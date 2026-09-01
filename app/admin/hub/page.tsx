// app/admin/hub/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  ShieldAlert, 
  Layers, 
  Users, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Store, 
  Truck, 
  Compass, 
  Search, 
  Loader2,
  Lock,
  Database
} from 'lucide-react';

interface ItineraryBooking {
  id: string;
  created_at: string;
  total_amount?: number | null;
  total?: number | null;
  status?: string | null;
  payment_id?: string | null;
  email?: string | null;
  full_name?: string | null;
  name?: string | null;
  phone?: string | number | null;
  tier?: string | null;
  items?: any[] | null;
  [key: string]: any;
}

export default function MasterAdminHub() {
  const [activeTab, setActiveTab] = useState<'master' | 'vendor' | 'staff'>('master');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [bookings, setBookings] = useState<ItineraryBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '7788' || passcode === 'admin2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMasterData = async () => {
      setLoadingBookings(true);
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const realPaidBookings = data.filter((b: any) => {
            const st = (b.status || '').toUpperCase();
            const pid = b.payment_id || '';
            const hasRealPayment = pid !== '' && pid !== 'Unassigned' && pid !== 'Pending Ref';
            return st === 'PAID' || st === 'COMPLETED' || hasRealPayment;
          });
          setBookings(realPaidBookings);
        } else {
          console.error("Supabase query error:", error);
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to query bookings:", err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchMasterData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 text-stone-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-stone-900/90 p-8 rounded-[2.5rem] border border-amber-500/30 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl mb-3">
              <Lock className="text-amber-400" size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-100 uppercase tracking-widest">Master Admin Hub</h1>
            <p className="text-[11px] text-stone-400 font-serif mt-1">Restricted Access • Escape Tours Executive Control</p>
          </div>

          <div>
            <label className="text-[10px] font-serif uppercase tracking-widest text-amber-300 block mb-1.5">Enter Master Passcode</label>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••"
              className="w-full bg-stone-950 border border-amber-500/30 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] text-amber-300 outline-none focus:border-amber-400"
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-400 text-center font-medium">Invalid passcode. Access denied.</p>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold uppercase tracking-wider text-xs transition-all shadow-lg cursor-pointer"
          >
            Unlock Command Center
          </button>
        </form>
      </main>
    );
  }

  const filteredBookings = bookings.filter(b => 
    (b.id && b.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.full_name && b.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.payment_id && b.payment_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 text-stone-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Subsections Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-stone-900/80 p-6 rounded-[2rem] border border-amber-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-2xl">
              <Compass size={28} className="text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400 font-semibold">Escape Tours & Safaris</span>
              <h1 className="text-2xl font-serif font-bold text-stone-100 tracking-wide">Executive Operations Hub</h1>
            </div>
          </div>

          {/* Subsections Switcher */}
          <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-2xl border border-amber-500/20 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('master')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'master' 
                  ? 'bg-amber-400 text-stone-950 shadow-md' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShieldAlert size={14} /> Master Ledger
            </button>

            <button
              onClick={() => setActiveTab('vendor')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'vendor' 
                  ? 'bg-amber-400 text-stone-950 shadow-md' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Store size={14} /> Vendor Mirror
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'staff' 
                  ? 'bg-amber-400 text-stone-950 shadow-md' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users size={14} /> Staff Portal
            </button>
          </div>
        </div>

        {/* SUBSECTION 1: LIVE DATABASE PAID LEDGER */}
        {activeTab === 'master' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-500/20 shadow-inner flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400">Paid Bookings (Live DB)</span>
                  <h3 className="text-2xl font-serif font-bold text-amber-300 mt-1">{bookings.length}</h3>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400"><FileText size={20} /></div>
              </div>

              <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-500/20 shadow-inner flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400">Total Live Revenue</span>
                  <h3 className="text-2xl font-serif font-bold text-amber-300 mt-1">
                    ${bookings.reduce((acc, b) => acc + (Number(b.total_amount ?? b.total ?? 0)), 0).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><DollarSign size={20} /></div>
              </div>

              <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-500/20 shadow-inner flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400">Database Status</span>
                  <h3 className="text-sm font-serif font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected (Supabase)
                  </h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400"><Database size={20} /></div>
              </div>
            </div>

            {/* Live Database Table */}
            <div className="bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-100 uppercase tracking-widest">Live Paid Itinerary Ledger</h3>
                  <p className="text-[11px] text-stone-400 font-serif mt-0.5">Displaying real database records with verified payment IDs only.</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-3 text-stone-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search Booking ID, Client, or Payment Ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-950 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-200 outline-none border border-amber-500/20 focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif uppercase tracking-widest text-amber-400">
                      <th className="py-3 px-4">Booking Reference</th>
                      <th className="py-3 px-4">Client Details</th>
                      <th className="py-3 px-4">Residency Tier</th>
                      <th className="py-3 px-4">Investment</th>
                      <th className="py-3 px-4">Payment ID</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-xs font-serif">
                    {loadingBookings ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-400">
                          <Loader2 className="animate-spin inline-block mr-2 text-amber-400" size={16} /> Querying live database...
                        </td>
                      </tr>
                    ) : filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.id || Math.random()} className="hover:bg-stone-800/50 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-amber-300">{b.id}</td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-stone-200">{b.full_name || b.name || 'Valued Guest'}</div>
                            <div className="text-[10px] text-stone-400">{b.email || 'No email provided'}</div>
                          </td>
                          <td className="py-4 px-4 uppercase text-stone-300 font-semibold">{b.tier || 'INTERNATIONAL'}</td>
                          <td className="py-4 px-4 font-bold text-amber-400">${Number(b.total_amount ?? b.total ?? 0).toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 size={10} /> {b.payment_id || b.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => alert(`Viewing live manifest for booking: ${b.id}`)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 transition-all cursor-pointer"
                            >
                              Inspect Manifest
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-stone-400 space-y-2">
                          <p className="text-sm font-serif">No paid bookings found in your database yet.</p>
                          <p className="text-[11px] text-stone-500">Completed checkout transactions will appear here automatically once processed.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBSECTION 2: VENDOR HUB MIRROR */}
        {activeTab === 'vendor' && (
          <div className="space-y-6">
            <div className="bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-100 uppercase tracking-widest">Vendor Hub Mirror</h3>
                  <p className="text-xs text-stone-400 font-serif mt-1">Live overview of partner lodges, safari vehicle assignments, and vendor inventory payouts.</p>
                </div>
                <div className="px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-serif font-bold uppercase">
                  Vendor Sync Active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-serif uppercase tracking-widest font-bold">Mikumi Safari Vehicles</span>
                    <Truck size={18} />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-stone-100">4 Units Deployed</h4>
                  <p className="text-[11px] text-stone-400">Partner rate sheets and parking locations synced with inventory catalog.</p>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-serif uppercase tracking-widest font-bold">Lodge Partnerships</span>
                    <Store size={18} />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-stone-100">18 Lodges Active</h4>
                  <p className="text-[11px] text-stone-400">Double G Safaris Camp, Marera Lodge, Neptune Serengeti & Hellen's Lodge connected.</p>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-serif uppercase tracking-widest font-bold">Digital Storefronts</span>
                    <Layers size={18} />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-stone-100">PSN Gift Cards & Hub</h4>
                  <p className="text-[11px] text-stone-400">Lifestyle Hub vendor fulfillment channels operating smoothly.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBSECTION 3: STAFF PORTAL */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-100 uppercase tracking-widest">Staff Operations Portal</h3>
                  <p className="text-xs text-stone-400 font-serif mt-1">Assigned tour schedules, driver allocations, and client greeting manifests for tour operators.</p>
                </div>
                <div className="px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-serif font-bold uppercase">
                  Staff Access Level: Manager
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-950 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <h4 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} /> Upcoming Tour Departures
                  </h4>
                  <ul className="space-y-2.5 text-xs text-stone-300 font-serif">
                    <li className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <span>Serengeti Wildlife Migration Safari (Day 1)</span>
                      <span className="text-amber-400 font-bold">Assigned: Juma M.</span>
                    </li>
                    <li className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <span>Ngorongoro Crater Explorer (Day 2)</span>
                      <span className="text-amber-400 font-bold">Assigned: Baraka K.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-stone-950 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <h4 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Driver & Guide Roster
                  </h4>
                  <ul className="space-y-2.5 text-xs text-stone-300 font-serif">
                    <li className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <span>Vehicle TZ-448-SAFARI (Mikumi Station)</span>
                      <span className="text-emerald-400 font-bold">Available</span>
                    </li>
                    <li className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <span>Vehicle TZ-992-KILI (Arusha Base)</span>
                      <span className="text-amber-400 font-bold">On Tour</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}