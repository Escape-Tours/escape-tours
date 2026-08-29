// components/hub/UserDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Sparkles,
  ExternalLink,
  FileCheck,
  LogOut,
  Gift,
  PlusCircle,
  Lock,
  UserCheck,
  MessageCircle,
  ShoppingBag,
  Zap,
  Globe,
  Award,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Check
} from 'lucide-react';

interface UserDashboardProps {
  tier?: string;
  userName?: string;
}

export default function UserDashboard({ tier = 'CITIZEN', userName }: UserDashboardProps) {
  const router = useRouter();
  const [totalItineraries, setTotalItineraries] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [draftSessions, setDraftSessions] = useState(0);
  const [itineraryList, setItineraryList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'confirmed'>('all');
  const [displayName, setDisplayName] = useState<string>(userName || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>(tier);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Digital Storefront State
  const [storefrontItems, setStorefrontItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  const activeDisplayTier = userTier.toUpperCase();

  useEffect(() => {
    const fetchUserHubData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsAuthenticated(false);
        setLoading(false);
        setLoadingStore(false);
        return;
      }

      setIsAuthenticated(true);
      const currentUser = session.user;
      const userId = currentUser.id;

      const metaAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
      if (metaAvatar) setAvatarUrl(metaAvatar);

      const { data: profile } = await (supabase.from('profiles' as any) as any)
        .select('full_name, name, username, avatar_url, residency_tier, tier')
        .eq('id', userId)
        .single();
      
      const resolvedTier = profile?.residency_tier || profile?.tier || tier;
      setUserTier(resolvedTier.toUpperCase());

      if (profile?.avatar_url && !metaAvatar) {
        setAvatarUrl(profile.avatar_url);
      }

      const resolvedName = 
        profile?.full_name || 
        profile?.name || 
        profile?.username ||
        currentUser.user_metadata?.full_name || 
        currentUser.user_metadata?.name || 
        currentUser.user_metadata?.first_name ||
        (currentUser.email ? currentUser.email.split('@')[0] : 'Valued Explorer');

      setDisplayName(resolvedName);

      const { data: itineraries, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (itineraries && !error) {
        setItineraryList(itineraries);
        applyTierAndFilter(itineraries, resolvedTier, activeFilter);
      }

      const { data: storeData } = await (supabase.from('storefront_items' as any) as any)
        .select('*')
        .eq('is_active', true);
      
      if (storeData) {
        setStorefrontItems(storeData);
      }
      setLoadingStore(false);
      setLoading(false);
    };

    fetchUserHubData();
  }, [tier, userName]);

  const applyTierAndFilter = (list: any[], currentTier: string, filter: 'all' | 'draft' | 'confirmed') => {
    const targetTier = currentTier.toUpperCase();
    const validItineraries = list.filter(item => 
      !item.tier || item.tier.toUpperCase() === targetTier
    );

    setTotalItineraries(validItineraries.length);
    const drafts = validItineraries.filter(item => item.status === 'draft' || item.status === 'secured' || !item.status);
    const booked = validItineraries.filter(item => item.status === 'confirmed');
    
    setDraftSessions(drafts.length);
    setConfirmedBookings(booked.length);

    if (filter === 'all') {
      setFilteredList(validItineraries);
    } else if (filter === 'draft') {
      setFilteredList(drafts);
    } else if (filter === 'confirmed') {
      setFilteredList(booked);
    }
  };

  const handleFilterChange = (filter: 'all' | 'draft' | 'confirmed') => {
    setActiveFilter(filter);
    applyTierAndFilter(itineraryList, userTier, filter);
  };

  const handleAddToCart = (item: any) => {
    setCart(prev => [...prev, item]);
    setCartNotification(`Added "${item.title || 'Item'}" to cart`);
    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error logging out:', err);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-36 gap-6 bg-[#050505] min-h-[70vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border border-amber-500/30 flex items-center justify-center shadow-2xl">
            <Loader2 className="animate-spin text-amber-400" size={36} />
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">Synchronizing Vault</p>
          <p className="text-xs text-neutral-500">Decrypting secure explorer session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 bg-[#050505] min-h-[85vh] flex items-center">
        <div className="w-full bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800/80 rounded-[2.5px] p-8 sm:p-10 text-center space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Lock size={32} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold">
              Restricted Secure Zone
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Escape+ Vault Access</h1>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              This private client portal is reserved for verified travelers. Sign in or register your credentials to manage custom expeditions and lifestyle benefits.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 group"
            >
              <UserCheck size={16} className="group-hover:scale-110 transition-transform" /> Sign In to User Hub
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider border border-neutral-800"
            >
              Return to Explorer Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = displayName && displayName !== 'Valued Explorer' && displayName !== 'Loading...'
    ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'EX';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-neutral-100 bg-[#050505] min-h-screen selection:bg-amber-500 selection:text-neutral-950 relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />

      {cartNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-neutral-950 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles size={16} /> {cartNotification}
        </div>
      )}

      {/* Hero Welcome Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-neutral-950 border border-neutral-800/80 p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 w-full lg:w-auto">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full rounded-[22px] bg-neutral-950 flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-amber-400 font-mono tracking-wider">{initials}</span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-neutral-950 w-5 h-5 rounded-full shadow-lg flex items-center justify-center" title="Active Connection">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-widest shadow-inner">
              <Sparkles size={13} className="animate-spin" style={{ animationDuration: '4s' }} /> 
              Escape+ Portal Active &bull; <span className="text-white">{activeDisplayTier}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">{displayName}</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
              Manage your custom Tanzanian expeditions, monitor draft roadmap sessions, and oversee your exclusive travel credentials in real-time.
            </p>
          </div>
        </div>

        {/* Quick Stats Pill Grid */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto relative z-10 shrink-0">
          <div className="bg-neutral-900/90 border border-neutral-800/80 px-5 py-4 rounded-2xl text-center shadow-lg hover:border-amber-500/40 transition group">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold mb-1 group-hover:text-amber-400 transition-colors">Trips</span>
            <span className="text-2xl font-black text-amber-400">{totalItineraries}</span>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800/80 px-5 py-4 rounded-2xl text-center shadow-lg hover:border-blue-500/40 transition group">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold mb-1 group-hover:text-blue-400 transition-colors">Drafts</span>
            <span className="text-2xl font-black text-blue-400">{draftSessions}</span>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800/80 px-5 py-4 rounded-2xl text-center shadow-lg hover:border-emerald-500/40 transition group">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold mb-1 group-hover:text-emerald-400 transition-colors">Booked</span>
            <span className="text-2xl font-black text-emerald-400">{confirmedBookings}</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Itineraries & Storefront */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Builder Banner Callout */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            <div className="space-y-1.5 text-center sm:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                <Zap size={12} /> Itinerary Studio Blueprint
              </div>
              <h3 className="text-xl font-black text-white">Ready for your next East African expedition?</h3>
              <p className="text-xs text-neutral-300 font-medium max-w-md leading-relaxed">
                Design custom itineraries using live Serengeti & Zanzibar rates tailored strictly to your <span className="text-amber-400 font-bold">{activeDisplayTier}</span> tier.
              </p>
            </div>
            <a 
              href="/itinerary-builder" 
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black px-7 py-4 rounded-2xl transition-all text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_10px_25px_rgba(245,158,11,0.25)] shrink-0 relative z-10 group/btn"
            >
              Build New Trip <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Itineraries Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/80">
              <h2 className="text-lg font-black flex items-center gap-2.5 text-white">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Compass size={18} />
                </div>
                Saved Itineraries & Drafts
                <span className="text-xs font-mono font-normal text-neutral-400 px-2 py-0.5 bg-neutral-800/80 rounded-md">
                  {activeDisplayTier}
                </span>
              </h2>
              
              <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 p-1 rounded-xl shadow-inner w-full sm:w-auto">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'all' ? 'bg-amber-400 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({totalItineraries})
                </button>
                <button
                  onClick={() => handleFilterChange('draft')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'draft' ? 'bg-amber-400 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Drafts ({draftSessions})
                </button>
                <button
                  onClick={() => handleFilterChange('confirmed')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'confirmed' ? 'bg-amber-400 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Confirmed ({confirmedBookings})
                </button>
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-16 text-center space-y-4 shadow-xl backdrop-blur-md">
                <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center mx-auto text-neutral-400">
                  <FileText size={32} />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">No Itineraries Match This Filter</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You don't have any items under the <span className="text-amber-400 font-bold">{activeDisplayTier}</span> tier category. Start a new custom safari session today.
                  </p>
                </div>
                <a 
                  href="/itinerary-builder" 
                  className="inline-flex items-center gap-2 mt-3 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider shadow"
                >
                  Open Itinerary Builder →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredList.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800/80 hover:border-amber-500/50 transition-all rounded-3xl p-6 space-y-5 flex flex-col justify-between group shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

                    <div className="space-y-3.5 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg font-bold shadow-sm">
                          {item.tier || activeDisplayTier} TIER
                        </span>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-sm ${
                          item.status === 'confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                        }`}>
                          {item.status === 'confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.status || 'Draft Session'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        <a href={`/client-portal/tracking?id=${item.id}`} className="hover:underline">
                          {item.title || 'Custom Safari Expedition'}
                        </a>
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-400" /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-amber-400" /> Tanzania Circuit</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/85 flex items-center justify-between relative z-10">
                      <span className="text-xs font-bold text-neutral-300 font-mono">
                        {item.total_days ? `${item.total_days} Mapped Days` : 'Custom Schedule'}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <a 
                          href={`/itinerary-builder?id=${item.id}`} 
                          className="text-xs font-bold text-neutral-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-neutral-800"
                        >
                          Edit
                        </a>
                        <a 
                          href={`/client-portal/tracking?id=${item.id}`} 
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl"
                        >
                          Launch Portal <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lifestyle Hub: Digital Storefront Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/80">
              <div className="space-y-0.5">
                <h2 className="text-lg font-black flex items-center gap-2.5 text-white">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                    <ShoppingBag size={18} />
                  </div>
                  Lifestyle Hub: Digital Storefront
                </h2>
                <p className="text-xs text-neutral-400 pl-11">
                  Exclusive vendor items, PSN gift cards, and digital essentials fulfilled instantly.
                </p>
              </div>
              {cart.length > 0 && (
                <div className="bg-amber-500 text-neutral-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                  <Gift size={13} /> Cart ({cart.length})
                </div>
              )}
            </div>

            {loadingStore ? (
              <div className="py-12 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-amber-400" /> Loading Digital Storefront Inventory...
              </div>
            ) : storefrontItems.length === 0 ? (
              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-10 text-center text-xs text-neutral-400 space-y-2">
                <p className="font-bold text-white">Storefront Catalog Updating</p>
                <p className="text-neutral-500 max-w-sm mx-auto">PSN Gift Cards and exclusive vendor digital assets will appear here soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {storefrontItems.map((prod) => (
                  <div 
                    key={prod.id} 
                    className="bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800/80 hover:border-amber-500/50 transition-all rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

                    <div className="space-y-3 relative z-10">
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-800 text-amber-300 px-3 py-1 rounded-lg border border-neutral-700 font-bold inline-block">
                        {prod.category || 'Digital Vendor'}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{prod.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/85 relative z-10">
                      <span className="text-base font-black text-amber-400 font-mono">${prod.price}</span>
                      <button 
                        onClick={() => handleAddToCart(prod)}
                        className="bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-amber-400 border border-neutral-700/80 font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow group/btn"
                      >
                        <PlusCircle size={14} className="group-hover/btn:rotate-90 transition-transform" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Account Status, Credentials & Concierge */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800/80 rounded-[2.5rem] p-7 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold block mb-1">Account Standing</span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={20} /> Verified Explorer
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award size={20} />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80 relative z-10 font-mono text-xs">
              <div className="flex justify-between items-center bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-400">Residency Tier</span>
                <span className="font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 uppercase shadow-inner">{activeDisplayTier}</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-400">Gateway Security</span>
                <span className="text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 shadow-inner">SECURE SSL</span>
              </div>
            </div>

            {/* Travel Credentials Vault */}
            <div className="bg-neutral-950 border border-neutral-800/80 p-5 rounded-2xl space-y-4 shadow-inner relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold">Travel Credentials</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Vault Synced
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-neutral-200 flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="flex items-center gap-2.5"><FileCheck size={15} className="text-amber-400" /> Passport Verification</span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/20">VERIFIED</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider border border-neutral-800 flex items-center justify-center gap-2 group"
              >
                {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />}
                Sign Out from Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}