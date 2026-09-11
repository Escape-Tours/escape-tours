// app/driver-portal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Truck, Plus, Trash2, CheckCircle, MapPin, DollarSign, ShieldAlert, Sparkles, LogOut, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DriverPortalPage() {
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [postings, setPostings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form states for custom driver marketplace listings
  const [title, setTitle] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [region, setRegion] = useState('');
  const [postingLoading, setPostingLoading] = useState(false);

  // Check existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setDriverEmail(session.user.email || '');
        setUserId(session.user.id);
        setIsLoggedIn(true);
        fetchDispatches(session.user.id);
        fetchDriverPostings(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setDriverEmail(session.user.email || '');
        setUserId(session.user.id);
        setIsLoggedIn(true);
        fetchDispatches(session.user.id);
        fetchDriverPostings(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setDispatches([]);
        setPostings([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDispatches = async (uid: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase
        .from('financial_ledgers' as any) as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching driver assignments:', error.message);
        setDispatches([]);
      } else {
        setDispatches(data || []);
      }
    } catch (err) {
      console.error(err);
      setDispatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDriverPostings = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('driver_postings')
        .select('*')
        .eq('driver_id', uid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching postings:', error.message);
        setPostings([]);
      } else {
        setPostings(data || []);
      }
    } catch (err) {
      console.error(err);
      setPostings([]);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverEmail || !driverPassword) return;
    setIsLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: driverEmail,
          password: driverPassword,
        });
        if (error) throw error;
        alert('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: driverEmail,
          password: driverPassword,
        });
        if (error) throw error;
        if (data.user) {
          setIsLoggedIn(true);
          setUserId(data.user.id);
          fetchDispatches(data.user.id);
          fetchDriverPostings(data.user.id);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserId(null);
    setDriverEmail('');
    setDriverPassword('');
    setDispatches([]);
    setPostings([]);
  };

  const updateStatus = async (id: string, status: string) => {
    setDispatches(prev =>
      prev.map(item => (item.id === id ? { ...item, dispatch_status: status } : item))
    );
    alert(`Trip status updated to: ${status}`);
  };

  const handleCreatePosting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pricePerDay || !userId) return;

    setPostingLoading(true);
    try {
      const { error } = await supabase.from('driver_postings').insert([
        {
          driver_id: userId,
          driver_email: driverEmail,
          title,
          vehicle_model: vehicleModel,
          price_per_day: parseFloat(pricePerDay),
          region,
          status: 'AVAILABLE'
        }
      ]);

      if (error) throw error;

      setTitle('');
      setVehicleModel('');
      setPricePerDay('');
      setRegion('');
      fetchDriverPostings(userId);
      alert('Vehicle posting successfully published to the marketplace!');
    } catch (err: any) {
      alert(`Error publishing posting: ${err.message || 'Unknown error'}`);
    } finally {
      setPostingLoading(false);
    }
  };

  const handleDeletePosting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const { error } = await supabase.from('driver_postings').delete().eq('id', id);
      if (error) throw error;
      if (userId) fetchDriverPostings(userId);
    } catch (err: any) {
      alert(`Error deleting posting: ${err.message}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Escape+ Logistics
            </span>
            <h1 className="text-xl font-black tracking-tight mt-4">Mikumi Driver & Partner Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp ? 'Create your partner account to manage dispatches and vehicles.' : 'Sign in with your partner credentials to access your dashboard.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Partner Email</label>
              <input
                type="email"
                required
                value={driverEmail}
                onChange={(e) => setDriverEmail(e.target.value)}
                placeholder="driver@escapetourstz.com"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <input
                type="password"
                required
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Create Partner Account' : 'Access Partner Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Register here"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Profile Section */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Mikumi Base Active
            </span>
            <h1 className="text-lg font-black tracking-tight mt-2">Driver & Fleet Dashboard</h1>
            <p className="text-xs text-slate-400">Logged in as: {driverEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/5"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Assigned Itinerary Dispatches Section */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Navigation size={16} className="text-emerald-400" />
              Assigned Itinerary Dispatches
            </h2>
            <span className="text-xs text-slate-400 font-medium">{dispatches.length} Total</span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Loading assignments...</p>
            </div>
          ) : dispatches.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">No active vehicle assignments currently found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dispatches.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">Ref: {item.gateway_reference}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                        {item.dispatch_status || 'Ready for Dispatch'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400" /> Location: Mikumi National Park Safari Circuit
                    </p>
                    <p className="text-[10px] text-amber-400 font-bold mt-0.5 flex items-center gap-1">
                      <DollarSign size={12} /> Allocation Share: ${item.allocated_amount} {item.currency}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'En Route')}
                      className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/20 transition-all cursor-pointer"
                    >
                      En Route
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'Completed')}
                      className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Driver Vehicle Postings Section */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Truck size={18} />
              Publish Custom Vehicle / Transfer Listing
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              List your 4x4 safari cruiser or transport slot directly onto the Escape+ marketplace for bookings.
            </p>
          </div>

          <form onSubmit={handleCreatePosting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Service Title</label>
              <input
                type="text"
                placeholder="e.g. 4x4 Land Cruiser Safari Ready"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Vehicle Model</label>
              <input
                type="text"
                placeholder="e.g. Toyota Land Cruiser V8"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Rate Per Day ($)</label>
              <input
                type="number"
                placeholder="250"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Operating Region</label>
              <input
                type="text"
                placeholder="e.g. Northern Circuit / Mikumi"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button
                disabled={postingLoading}
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus size={16} />
                {postingLoading ? 'Publishing...' : 'Publish Listing to Marketplace'}
              </Button>
            </div>
          </form>

          {/* Active Listings Grid */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Your Active Fleet Postings ({postings.length})
            </h3>

            {postings.length === 0 ? (
              <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 italic">You haven't posted any vehicles or transfer slots yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {postings.map((post) => (
                  <div key={post.id} className="bg-slate-950 border border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          {post.status}
                        </span>
                        <span className="text-xs font-black text-amber-400 flex items-center gap-0.5">
                          <DollarSign size={14} /> ${post.price_per_day} / day
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{post.title}</h4>
                      {post.vehicle_model && (
                        <p className="text-xs text-slate-400 mt-1">Vehicle: {post.vehicle_model}</p>
                      )}
                      {post.region && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-emerald-400" /> {post.region}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleDeletePosting(post.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} /> Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}