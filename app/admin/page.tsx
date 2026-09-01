// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTaskSync } from '@/lib/hooks/useTaskSync';
import { 
  LayoutGrid, 
  ChevronRight, 
  Activity, 
  Phone, 
  FileText,  
  Compass, 
  Crown, 
  Sparkles,
  DollarSign,
  Truck,
  Gift,
  MessageSquare,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  passport_number: string | null;
  residency_tier: string;
  updated_at: string;
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

export default function ComprehensiveExecutiveAdmin() {
  const { status: systemStatus, isLoading } = useTaskSync('system-health');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'vendors' | 'fleet' | 'storefront' | 'comms'>('dashboard');
  
  // States
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [vendors, setVendors] = useState<VendorLedger[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  
  const [fleet, setFleet] = useState<FleetAsset[]>([
    { id: 'F-01', vehicle_code: 'CRUISER-04 (Mikumi)', location: 'Mikumi Gate', driver_name: 'Charles Geofrey', status: 'DISPATCHED', drone_auth: 'TCAA-AV2-881' },
    { id: 'F-02', vehicle_code: 'CRUISER-09 (Serengeti)', location: 'Serora Airstrip', driver_name: 'Juma Kassim', status: 'STANDBY', drone_auth: 'TCAA-AV2-902' }
  ]);
  const [orders, setOrders] = useState<DigitalOrder[]>([
    { id: 'ORD-501', item_name: '$100 PlayStation Network (PSN) Gift Card', client_email: 'alistair@sterling.co.uk', status: 'DISPATCHED' },
    { id: 'ORD-502', item_name: '$50 PSN Gift Card', client_email: 'genevieve.dupont@gmail.com', status: 'QUEUED' }
  ]);
  
  const [userLoading, setUserLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setUserLoading(true);
    const supabase = createClient();
    const { data, error } = await (supabase.from('profiles' as any) as any)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const formattedData = (data || []).map((p: any) => ({
        ...p,
        residency_tier: p.residency_tier ? p.residency_tier.toUpperCase().trim() : 'CITIZEN'
      }));
      setProfiles(formattedData);
    }
    setUserLoading(false);
  };

  const fetchVendors = async () => {
    setVendorLoading(true);
    const supabase = createClient();
    const { data, error } = await (supabase.from('vendors' as any) as any)
      .select('*')
      .order('vendor_name', { ascending: true });

    if (error) {
      console.error('Error fetching vendors:', error.message);
      // Fallback schema table check if table name varies
      const { data: altData, error: altError } = await (supabase.from('vendor_partners' as any) as any).select('*');
      if (!altError && altData) {
        setVendors(altData.map((v: any) => ({
          id: v.id || Math.random().toString(),
          vendor_name: v.vendor_name || v.name || 'Partner Vendor',
          service_type: v.service_type || v.category || 'Luxury Lodge',
          commission_rate: v.commission_rate || v.markup || 15,
          balance_payout: v.balance_payout || v.payout || 2500,
          status: (v.status || 'PENDING').toUpperCase()
        })));
      }
    } else if (data) {
      setVendors(data.map((v: any) => ({
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

  useEffect(() => {
    fetchProfiles();
    fetchVendors();
  }, []);

  const updateTier = async (userId: string, newTier: string) => {
    setActionLoading(userId);
    const supabase = createClient();
    
    const { error } = await (supabase.from('profiles' as any) as any)
      .update({ residency_tier: newTier, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      alert('Error updating residency tier: ' + error.message);
    } else {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, residency_tier: newTier } : p));
    }
    setActionLoading(null);
  };

  const settleVendor = async (vendorId: string) => {
    setActionLoading(vendorId);
    const supabase = createClient();

    const { error } = await (supabase.from('vendors' as any) as any)
      .update({ status: 'SETTLED', balance_payout: 0 })
      .eq('id', vendorId);

    if (error) {
      // Try alternate table name if direct table update fails
      await (supabase.from('vendor_partners' as any) as any)
        .update({ status: 'SETTLED', balance_payout: 0 })
        .eq('id', vendorId);
    }

    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'SETTLED', balance_payout: 0 } : v));
    setActionLoading(null);
  };

  const totalUsers = profiles.length;

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
            { id: 'users', label: 'User Hub', icon: <Activity size={14} /> },
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
              <MetricCard label="Registered Guests" value={totalUsers.toString()} icon={<LayoutGrid size={20} />} trend="Live DB Sync" onClick={() => setActiveTab('users')} />
              <MetricCard label="Vendor Payouts Pending" value={`$${vendors.reduce((a,c)=>a+c.balance_payout,0).toLocaleString()}`} icon={<DollarSign size={20} />} color="amber" action="Audit Matrix" onClick={() => setActiveTab('vendors')} />
              <MetricCard label="Fleet & Drones Active" value={fleet.length.toString()} icon={<Truck size={20} />} color="emerald" action="Dispatch Hub" onClick={() => setActiveTab('fleet')} />
              <MetricCard label="PSN Store Queue" value={orders.filter(o=>o.status==='QUEUED').length.toString()} icon={<Gift size={20} />} color="amber" action="Fulfill" onClick={() => setActiveTab('storefront')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-8">
                <h3 className="font-serif font-bold text-lg text-stone-100 uppercase tracking-widest mb-4">Recent Activity Stream</h3>
                <div className="divide-y divide-stone-800/60">
                  {profiles.slice(0, 4).map((p) => (
                    <div key={p.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-serif font-bold text-stone-200">{p.full_name || 'Anonymous Guest'}</p>
                        <p className="text-xs text-stone-400 font-serif">Tier: <span className="text-amber-300 font-bold uppercase">{p.residency_tier}</span> | Phone: {p.phone_number || 'N/A'}</p>
                      </div>
                      <ChevronRight size={16} className="text-amber-500/50" />
                    </div>
                  ))}
                  {profiles.length === 0 && <p className="text-stone-500 font-serif text-sm py-6">No recent guest registrations.</p>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-zinc-950 text-stone-100 rounded-[2.5rem] border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-amber-400" size={18} />
                    <h3 className="font-serif font-bold text-base uppercase tracking-widest text-stone-100">Executive Shortcuts</h3>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab('vendors')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>Manage Supplier Margins</span>
                      <ChevronRight size={14} className="text-amber-400" />
                    </button>
                    <button onClick={() => setActiveTab('fleet')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>Mikumi/Serengeti Fleet Status</span>
                      <ChevronRight size={14} className="text-amber-400" />
                    </button>
                    <button onClick={() => setActiveTab('comms')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>WhatsApp & SMS Triggers</span>
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

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Client Verification & Residency Tiers</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Review live client credentials and manage residency pricing brackets.</p>
              </div>
              <button onClick={fetchProfiles} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={userLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Passport Number</th>
                    <th className="p-4">Residency Tier</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/40">
                      <td className="p-4 font-bold text-stone-100 text-sm">{p.full_name || 'Anonymous Client'}</td>
                      <td className="p-4 text-stone-300 flex items-center gap-1.5"><Phone size={13} className="text-amber-400" />{p.phone_number || 'N/A'}</td>
                      <td className="p-4 text-stone-300 font-mono"><FileText size={13} className="text-blue-400 inline mr-1" />{p.passport_number || 'Pending'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.residency_tier === 'CITIZEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          p.residency_tier === 'RESIDENT' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.residency_tier}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button disabled={actionLoading === p.id} onClick={() => updateTier(p.id, 'CITIZEN')} className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 text-stone-300 rounded-lg text-[9px] uppercase font-bold border border-stone-800 cursor-pointer">Citizen</button>
                        <button disabled={actionLoading === p.id} onClick={() => updateTier(p.id, 'RESIDENT')} className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 text-purple-300 rounded-lg text-[9px] uppercase font-bold border border-purple-500/30 cursor-pointer">Resident</button>
                        <button disabled={actionLoading === p.id} onClick={() => updateTier(p.id, 'INTERNATIONAL')} className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 text-amber-300 rounded-lg text-[9px] uppercase font-bold border border-amber-500/30 cursor-pointer">Intl</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VENDOR RATE & COMMISSION MATRIX (LIVE SUPABASE DATA) */}
        {activeTab === 'vendors' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Vendor Rate & Commission Matrix</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Live Supabase supplier contracts, lodge markups, and payout settlements.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchVendors} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                  <RefreshCw size={14} className={vendorLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
                <button onClick={() => alert("New vendor contract portal opened.")} className="px-4 py-2.5 bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-300 cursor-pointer">
                  + Add Partner Vendor
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {vendorLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Supabase Vendors...</span>
                </div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No vendor records found in the active database table.</p>
                  <p className="text-[10px] font-mono text-amber-400 mt-1">Check table schema `vendors` or `vendor_partners` in Supabase SQL editor.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">Vendor Partner</th>
                      <th className="p-4">Service Type</th>
                      <th className="p-4">Commission Markup</th>
                      <th className="p-4">Balance Payout</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-bold text-stone-100">{v.vendor_name}</td>
                        <td className="p-4 text-stone-300">{v.service_type}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">{v.commission_rate}%</td>
                        <td className="p-4 font-mono font-extrabold text-stone-100">${Number(v.balance_payout || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${v.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            disabled={actionLoading === v.id || v.status === 'SETTLED'}
                            onClick={() => settleVendor(v.id)} 
                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition cursor-pointer ${
                              v.status === 'SETTLED' 
                                ? 'bg-stone-950 text-stone-600 border-stone-800 cursor-not-allowed' 
                                : 'bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {actionLoading === v.id ? 'Settling...' : v.status === 'SETTLED' ? 'Settled' : 'Settle Payout'}
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

        {/* TAB 4: FLEET & DRONES */}
        {activeTab === 'fleet' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Live Fleet & TCAA Drone Dispatch Center</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Track 4x4 safari cruisers in Mikumi/Serengeti and DJI Avata 2 aviation compliance.</p>
              </div>
              <button onClick={() => alert("New vehicle dispatch logged.")} className="px-4 py-2.5 bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-300 cursor-pointer">
                + Dispatch Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fleet.map((f) => (
                <div key={f.id} className="bg-stone-950 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-stone-100 text-sm">{f.vehicle_code}</h3>
                      <p className="text-xs text-stone-400 mt-0.5">Assigned Driver: <span className="text-stone-200 font-bold">{f.driver_name}</span></p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${f.status === 'DISPATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                      {f.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 pt-2 border-t border-stone-800 flex justify-between">
                    <span>Location: <strong className="text-stone-200">{f.location}</strong></span>
                    <span>TCAA Drone ID: <strong className="text-amber-400 font-mono">{f.drone_auth}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DIGITAL STOREFRONT & GIFT CARDS */}
        {activeTab === 'storefront' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Digital Storefront & PSN Fulfillment</h2>
              <p className="text-xs text-stone-400 font-serif mt-1">Verify digital lifestyle payments and dispatch PlayStation Network gift card codes.</p>
            </div>

            <div className="divide-y divide-stone-800/60 bg-stone-950 rounded-2xl border border-amber-500/20 overflow-hidden">
              {orders.map((o) => (
                <div key={o.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{o.id}</span>
                    <h4 className="font-serif font-bold text-stone-100 text-sm mt-0.5">{o.item_name}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Client: {o.client_email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${o.status === 'DISPATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                      {o.status}
                    </span>
                    {o.status === 'QUEUED' && (
                      <button onClick={() => {
                        setOrders(orders.map(item => item.id === o.id ? {...item, status: 'DISPATCHED'} : item));
                      }} className="px-4 py-2 bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase rounded-xl hover:bg-amber-300 cursor-pointer">
                        Send Code & Instructions
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMMS & WHATSAPP */}
        {activeTab === 'comms' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Automated WhatsApp & Email Hub</h2>
              <p className="text-xs text-stone-400 font-serif mt-1">Configure automated triggers for safari confirmations, driver dispatch alerts, and payment receipts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                <h3 className="font-serif font-bold text-sm text-amber-400">WhatsApp Booking Alert</h3>
                <p className="text-xs text-stone-400">Sends instant safari itinerary confirmation and driver contact to client WhatsApp.</p>
                <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-bold">Active Trigger</span>
              </div>
              <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                <h3 className="font-serif font-bold text-sm text-amber-400">Payment Reminder Schedule</h3>
                <p className="text-xs text-stone-400">Automated 7-day and 24-hour balance due reminder via SMS & Email.</p>
                <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-bold">Active Trigger</span>
              </div>
              <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                <h3 className="font-serif font-bold text-sm text-amber-400">Driver Dispatch Notification</h3>
                <p className="text-xs text-stone-400">Alerts Mikumi/Serengeti drivers upon itinerary full payment clearance.</p>
                <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-bold">Active Trigger</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color = 'amber', trend, action, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-stone-900/90 p-6 rounded-[2rem] border border-amber-500/20 shadow-xl backdrop-blur-xl cursor-pointer hover:border-amber-400 hover:scale-[1.01] transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">{icon}</div>
        {action && <span className="text-[10px] font-serif uppercase tracking-widest font-bold text-amber-400 hover:text-amber-300">{action}</span>}
      </div>
      <p className="text-3xl font-serif font-extrabold text-stone-100">{value}</p>
      <p className="text-xs font-serif uppercase tracking-widest text-stone-400 mt-1">{label}</p>
      {trend && <p className="text-[10px] font-serif font-bold text-emerald-400 mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {trend}</p>}
    </div>
  );
}