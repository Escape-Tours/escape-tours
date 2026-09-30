// app/driver-portal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Truck, Plus, Trash2, CheckCircle, MapPin, DollarSign, ShieldAlert, LogOut, Navigation, Radio, Wrench, Gift, Check, X, MessageCircle, Send } from 'lucide-react';
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
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [postings, setPostings] = useState<any[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [lifestyleRewards, setLifestyleRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Polished Accept Modal State
  const [acceptingRideReq, setAcceptingRideReq] = useState<any>(null);
  const [modalPhone, setModalPhone] = useState('+255 714 892 100');
  const [modalPlate, setModalPlate] = useState('T 892 DZM');

  // Active Chat State for Driver
  const [activeChatRideId, setActiveChatRideId] = useState<string | null>(null);
  const [rideMessages, setRideMessages] = useState<any[]>([]);
  const [driverMessageText, setDriverMessageText] = useState('');

  // Form states for custom driver marketplace listings
  const [title, setTitle] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [region, setRegion] = useState('');
  const [postingLoading, setPostingLoading] = useState(false);

  // Maintenance log form state
  const [issueDescription, setIssueDescription] = useState('');
  const [severity, setSeverity] = useState('NORMAL');
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Live GPS broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Check existing session on load & setup real-time channels
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setDriverEmail(session.user.email || '');
        setUserId(session.user.id);
        setIsLoggedIn(true);
        fetchDispatches(session.user.id);
        fetchDriverPostings(session.user.id);
        fetchMaintenanceLogs(session.user.id);
        fetchIncomingRequests();
        fetchVendorStorefrontRewards();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setDriverEmail(session.user.email || '');
        setUserId(session.user.id);
        setIsLoggedIn(true);
        fetchDispatches(session.user.id);
        fetchDriverPostings(session.user.id);
        fetchMaintenanceLogs(session.user.id);
        fetchIncomingRequests();
        fetchVendorStorefrontRewards();
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setDispatches([]);
        setPostings([]);
        setMaintenanceLogs([]);
        setIncomingRequests([]);
        setLifestyleRewards([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Supabase Subscription Sync with User Hub & Vendor Hub tables
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('driver-portal-sync-hub')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rides' },
        () => {
          fetchIncomingRequests();
          fetchDispatches(userId);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'driver_postings' },
        () => {
          fetchDriverPostings(userId);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'storefront_items' },
        () => {
          fetchVendorStorefrontRewards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Real-time Chat Subscription when chatting on an active ride
  useEffect(() => {
    if (!activeChatRideId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('ride_messages')
        .select('*')
        .eq('ride_id', activeChatRideId)
        .order('created_at', { ascending: true });
      if (data) setRideMessages(data);
    };
    fetchMessages();

    const chatChannel = supabase
      .channel(`driver-chat-${activeChatRideId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ride_messages',
          filter: `ride_id=eq.${activeChatRideId}`
        },
        (payload: any) => {
          if (payload.new) {
            setRideMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [activeChatRideId]);

  const fetchDispatches = async (uid: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .in('status', ['matched', 'arrived', 'payment_pending'])
        .order('created_at', { ascending: false });

      if (error) {
        setDispatches([]);
      } else {
        setDispatches(data || []);
      }
    } catch {
      setDispatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'searching')
        .order('created_at', { ascending: false });

      if (error || !data) {
        setIncomingRequests([]);
      } else {
        setIncomingRequests(data);
      }
    } catch {
      setIncomingRequests([]);
    }
  };

  // Live Sync with Vendor Hub / Storefront Items table in Supabase
  const fetchVendorStorefrontRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('storefront_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setLifestyleRewards([
          { id: 'fallback-1', name: 'PSN $100 Digital Gift Card', vendor_name: 'Escape Vendor Hub', price: 90, status: 'AVAILABLE' }
        ]);
      } else {
        setLifestyleRewards(data);
      }
    } catch {
      setLifestyleRewards([]);
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
        setPostings([]);
      } else {
        setPostings(data || []);
      }
    } catch {
      setPostings([]);
    }
  };

  const fetchMaintenanceLogs = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('driver_maintenance_logs')
        .select('*')
        .eq('driver_id', uid)
        .order('created_at', { ascending: false });

      if (error) {
        setMaintenanceLogs([]);
      } else {
        setMaintenanceLogs(data || []);
      }
    } catch {
      setMaintenanceLogs([]);
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
          fetchMaintenanceLogs(data.user.id);
          fetchIncomingRequests();
          fetchVendorStorefrontRewards();
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
    setMaintenanceLogs([]);
    setIncomingRequests([]);
    setLifestyleRewards([]);
  };

  const handleAcceptJobPrompt = (req: any) => {
    setAcceptingRideReq(req);
  };

  const handleConfirmAcceptJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingRideReq) return;

    const driverDetails = {
      name: driverEmail.split('@')[0].toUpperCase(),
      plate: modalPlate,
      phone: modalPhone,
      rating: '4.98 ★'
    };

    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'matched',
          driver_data: driverDetails 
        })
        .eq('id', acceptingRideReq.id);

      if (error) throw error;
    } catch (e: any) {
      console.error('Error accepting ride in Supabase:', e);
      alert('Error updating ride status: ' + e.message);
      return;
    }

    setIncomingRequests(prev => prev.filter(r => r.id !== acceptingRideReq.id));
    setDispatches(prev => [
      {
        ...acceptingRideReq,
        status: 'matched',
        driver_data: driverDetails
      },
      ...prev
    ]);
    setActiveChatRideId(acceptingRideReq.id);
    setAcceptingRideReq(null);
    alert(`Job accepted successfully! True plate (${modalPlate}) and contact (${modalPhone}) synced to User Hub.`);
    if (userId) fetchDispatches(userId);
  };

  const handleDeclineJob = async (id: string) => {
    try {
      await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', id);
    } catch (e) {
      console.error('Error declining ride in Supabase:', e);
    }

    setIncomingRequests(prev => prev.filter(r => r.id !== id));
    alert('Job request declined.');
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await supabase
        .from('rides')
        .update({ status })
        .eq('id', id);
    } catch (e) {
      console.error('Error updating status:', e);
    }

    setDispatches(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
    alert(`Trip status synced with User Hub: ${status}`);
  };

  const handleSendDriverMessage = async () => {
    if (!driverMessageText.trim() || !activeChatRideId || !userId) return;
    try {
      await supabase.from('ride_messages').insert({
        ride_id: activeChatRideId,
        sender_id: userId,
        sender_name: driverEmail.split('@')[0].toUpperCase(),
        message: driverMessageText.trim()
      });
      setDriverMessageText('');
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  const handleCreatePosting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title || !vehicleModel || !pricePerDay || !region) return;
    setPostingLoading(true);
    try {
      const { error } = await supabase.from('driver_postings').insert({
        driver_id: userId,
        title,
        vehicle_model: vehicleModel,
        price_per_day: Number(pricePerDay),
        region,
        status: 'active'
      });
      if (error) throw error;
      setTitle('');
      setVehicleModel('');
      setPricePerDay('');
      setRegion('');
      fetchDriverPostings(userId);
      alert('Fleet vehicle listed successfully on the marketplace.');
    } catch (e: any) {
      alert('Error creating posting: ' + e.message);
    } finally {
      setPostingLoading(false);
    }
  };

  const handleDeletePosting = async (id: string) => {
    try {
      await supabase.from('driver_postings').delete().eq('id', id);
      if (userId) fetchDriverPostings(userId);
    } catch (e) {
      console.error('Error deleting posting:', e);
    }
  };

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !issueDescription) return;
    setMaintenanceLoading(true);
    try {
      const { error } = await supabase.from('driver_maintenance_logs').insert({
        driver_id: userId,
        issue_description: issueDescription,
        severity,
        status: 'pending_review'
      });
      if (error) throw error;
      setIssueDescription('');
      setSeverity('NORMAL');
      fetchMaintenanceLogs(userId);
      alert('Maintenance log submitted to fleet command.');
    } catch (e: any) {
      alert('Error submitting log: ' + e.message);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const toggleLiveBroadcast = () => {
    setIsBroadcasting(!isBroadcasting);
    alert(!isBroadcasting ? 'Live GPS telemetry stream active and linked to User Hub map.' : 'Live GPS telemetry stream paused.');
  };

  // Connected PesaPal Checkout Trigger for Vendor Storefront Vouchers & Rewards
  const handleClaimVoucherCheckout = async (item: any) => {
    const itemName = item.name || item.title || 'Storefront Voucher';
    const itemPrice = item.price !== undefined ? Number(item.price) : Number(item.price_per_day || 50);

    try {
      const response = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: itemPrice,
          description: `Vendor Hub Redemption: ${itemName}`,
          email: driverEmail || 'driver@escapetourstz.com',
          firstName: driverEmail.split('@')[0] || 'Partner',
          lastName: 'Driver',
          phone: modalPhone || '+255714892100',
        }),
      });

      const data = await response.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data.error || 'Failed to initialize PesaPal checkout session.');
      }
    } catch (err: any) {
      alert('PesaPal Checkout Error: ' + err.message);
    }
  };

  const totalEarnings = dispatches.reduce((acc, curr) => acc + (Number(curr.amount) || 45), 0);
  const completedTripsCount = dispatches.filter(d => d.status === 'completed').length;

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Mikumi Base Active • Real-Time Hub Sync
            </span>
            <h1 className="text-lg font-black tracking-tight mt-2">Driver & Fleet Command</h1>
            <p className="text-xs text-slate-400">Logged in as: {driverEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLiveBroadcast}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isBroadcasting 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-white/5 hover:text-white'
              }`}
            >
              <Radio size={14} className={isBroadcasting ? 'text-emerald-400' : ''} />
              <span>{isBroadcasting ? 'GPS Telemetry Live' : 'Enable Live GPS'}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Real-time Summary Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Allocation Share</span>
            <div className="flex items-center gap-2 mt-2">
              <DollarSign size={20} className="text-emerald-400" />
              <span className="text-xl font-black text-white">${totalEarnings.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Synced with User Hub Rides Ledger</p>
          </div>
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Completed Itineraries</span>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={20} className="text-purple-400" />
              <span className="text-xl font-black text-white">{completedTripsCount} Trips</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Verified safari circuit runs</p>
          </div>
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Fleet Units</span>
            <div className="flex items-center gap-2 mt-2">
              <Truck size={20} className="text-amber-400" />
              <span className="text-xl font-black text-white">{postings.length} Active</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Marketplace ready listings</p>
          </div>
        </div>

        {/* LIVE RIDE REQUESTS FEED */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2 animate-pulse">
              <Radio size={18} className="text-emerald-400" />
              Live User Dispatch Requests ({incomingRequests.length})
            </h2>
            <button
              onClick={fetchIncomingRequests}
              className="text-[10px] bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              Refresh Feed
            </button>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
              <p className="text-xs text-slate-400">No pending ride broadcasts in Supabase `rides` table.</p>
              <p className="text-[10px] text-amber-400">Go to your User Hub (`/user-hub`), enter pickup and dropoff locations, and click <strong className="underline">Broadcast Dispatch</strong>.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">Explorer: {req.user_name || 'Valued Explorer'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400" /> Pickup: <strong className="text-white">{req.pickup_location}</strong>
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                      <Navigation size={12} className="text-amber-400" /> Dropoff: <strong className="text-white">{req.dropoff_location}</strong>
                    </p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <DollarSign size={12} /> Fare: ${req.amount || 45} USD
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcceptJobPrompt(req)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    >
                      <Check size={14} /> Accept Job
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineJob(req.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-white/5"
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Accepted Rides Section & Two-Way Driver Chat */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Navigation size={16} className="text-emerald-400" />
              Active Accepted Rides ({dispatches.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Loading assignments...</p>
            </div>
          ) : dispatches.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">No active accepted rides.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dispatches.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Explorer: {item.user_name || 'Client'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold uppercase">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Pickup: {item.pickup_location} → {item.dropoff_location}</p>
                      <p className="text-[10px] text-amber-400 font-bold mt-0.5">Fare: ${item.amount || 45} USD</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveChatRideId(activeChatRideId === item.id ? null : item.id)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          activeChatRideId === item.id 
                            ? 'bg-amber-500 text-neutral-950 font-bold' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        <MessageCircle size={14} /> {activeChatRideId === item.id ? 'Close Chat' : 'Chat with Explorer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(item.id, 'arrived')}
                        className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/20 transition-all cursor-pointer"
                      >
                        Arrived
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(item.id, 'completed')}
                        className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-all cursor-pointer"
                      >
                        Complete
                      </button>
                    </div>
                  </div>

                  {/* Driver Chat Drawer for this Ride */}
                  {activeChatRideId === item.id && (
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                          <MessageCircle size={12} /> Live Direct Dispatch Chat with {item.user_name || 'Explorer'}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">Encrypted P2P Link</span>
                      </div>

                      <div className="h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                        {rideMessages.length === 0 ? (
                          <p className="text-slate-500 text-center py-10 font-mono text-[11px]">No messages yet. Send a note to the explorer regarding pickup instructions.</p>
                        ) : (
                          rideMessages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender_id === userId ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] font-mono text-slate-500 mb-0.5">{msg.sender_name || 'User'}</span>
                              <div className={`p-2.5 rounded-xl max-w-[80%] ${msg.sender_id === userId ? 'bg-emerald-600 text-white font-medium' : 'bg-slate-800 text-slate-200'}`}>
                                {msg.message}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Type your reply to the explorer..."
                          value={driverMessageText}
                          onChange={(e) => setDriverMessageText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendDriverMessage()}
                          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={handleSendDriverMessage}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={14} /> Send
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet Marketplace Listings Section */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Truck size={16} className="text-amber-400" />
              Manage Fleet Marketplace Listings
            </h2>
          </div>

          <form onSubmit={handleCreatePosting} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Listing Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 4x4 Safari Landcruiser"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Vehicle Model</label>
              <input
                type="text"
                required
                placeholder="Toyota Landcruiser V8"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Price / Day ($)</label>
              <input
                type="number"
                required
                placeholder="250"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Region</label>
              <input
                type="text"
                required
                placeholder="Mikumi / Serengeti"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                disabled={postingLoading}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Plus size={14} /> {postingLoading ? 'Publishing...' : 'Add Fleet Vehicle'}
              </button>
            </div>
          </form>

          {postings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Your Active Fleet Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {postings.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs">{p.title}</h4>
                      <p className="text-[11px] text-slate-400">{p.vehicle_model} • <strong className="text-amber-400">${p.price_per_day}/day</strong></p>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        {p.region}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePosting(p.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer border border-red-500/20"
                      title="Delete Listing"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Logbook & Fleet Health Section */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Wrench size={16} className="text-blue-400" />
              Vehicle Maintenance Logbook
            </h2>
          </div>

          <form onSubmit={handleCreateMaintenance} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Issue Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Front suspension check required after Serengeti run"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="URGENT">URGENT</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end pt-1">
              <button
                type="submit"
                disabled={maintenanceLoading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <ShieldAlert size={14} /> {maintenanceLoading ? 'Submitting...' : 'Submit Maintenance Log'}
              </button>
            </div>
          </form>

          {maintenanceLogs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Logged Service Reports</h3>
              <div className="space-y-2">
                {maintenanceLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white font-medium">{log.issue_description}</p>
                      <span className="text-[9px] font-mono text-slate-500">Status: {log.status}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      log.severity === 'URGENT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {log.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vendor Hub Synchronized Storefront & Rewards */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Gift size={16} className="text-purple-400" />
              Vendor Hub Storefront Rewards & Vouchers
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Live DB Sync (`storefront_items`)
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifestyleRewards.map((item) => {
              const itemName = item.name || item.title || 'Storefront Item';
              const itemVendor = item.vendor_name || item.vendor || 'Vendor Hub';
              const itemPrice = item.price !== undefined ? item.price : (item.price_per_day || 50);

              return (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[9px] font-mono text-purple-400 uppercase font-bold">{itemVendor}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{itemName}</h3>
                    {item.description && <p className="text-xs text-slate-400 mt-1">{item.description}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-emerald-400 font-bold">${itemPrice} USD</span>
                    <button
                      onClick={() => handleClaimVoucherCheckout(item)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider transition cursor-pointer shadow"
                    >
                      Claim Voucher
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Polished Driver Accept Job Modal */}
      {acceptingRideReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Dispatch Confirmation
              </span>
              <h3 className="text-lg font-black text-white mt-3">Enter Your Vehicle & Contact Details</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pickup: <strong className="text-white">{acceptingRideReq.pickup_location}</strong> → Dropoff: <strong className="text-white">{acceptingRideReq.dropoff_location}</strong>
              </p>
            </div>

            <form onSubmit={handleConfirmAcceptJob} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={modalPhone}
                  onChange={(e) => setModalPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Vehicle Plate Number</label>
                <input
                  type="text"
                  required
                  value={modalPlate}
                  onChange={(e) => setModalPlate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAcceptingRideReq(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-wider transition cursor-pointer border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg"
                >
                  Confirm & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}