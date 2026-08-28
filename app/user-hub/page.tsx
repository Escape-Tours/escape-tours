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
  Zap
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

  // Digital Storefront State (Vendor Database Items with rich visual fallback matching)
  const [storefrontItems, setStorefrontItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);

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

      // Extract avatar from provider metadata first
      const metaAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
      if (metaAvatar) setAvatarUrl(metaAvatar);

      // Fetch user profile from database to get official residency tier and full name
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('full_name, name, username, avatar_url, residency_tier, tier')
        .eq('id', userId)
        .single();
      
      const resolvedTier = profile?.residency_tier || profile?.tier || tier;
      setUserTier(resolvedTier.toUpperCase());

      if (profile?.avatar_url && !metaAvatar) {
        setAvatarUrl(profile.avatar_url);
      }

      // Resolve full name robustly across profile and user metadata
      const resolvedName = 
        profile?.full_name || 
        profile?.name || 
        profile?.username ||
        currentUser.user_metadata?.full_name || 
        currentUser.user_metadata?.name || 
        currentUser.user_metadata?.first_name ||
        (currentUser.email ? currentUser.email.split('@')[0] : 'Valued Explorer');

      setDisplayName(resolvedName);

      // Fetch itineraries linked to this specific user profile
      const { data: itineraries, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (itineraries && !error) {
        setItineraryList(itineraries);
        applyTierAndFilter(itineraries, resolvedTier, activeFilter);
      }

      // Fetch live vendor items from the database (`lifestyle_hub_items` / `storefront_items`)
      let rawStoreData: any[] | null = null;
      
      const { data: primaryStore } = await supabase
        .from('lifestyle_hub_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (primaryStore && primaryStore.length > 0) {
        rawStoreData = primaryStore;
      } else {
        const { data: fallbackStore } = await supabase
          .from('storefront_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackStore) {
          rawStoreData = fallbackStore;
        }
      }

      // Curated high-fidelity image mapping for vendor items based on title keywords
      const getImageForProduct = (title: string, category: string, existingImage?: string) => {
        if (existingImage && existingImage.startsWith('http')) return existingImage;
        const lower = (title + ' ' + category).toLowerCase();
        if (lower.includes('psn') || lower.includes('playstation') || lower.includes('card')) {
          return 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&q=80';
        }
        if (lower.includes('esim') || lower.includes('data') || lower.includes('tanzania') || lower.includes('sim')) {
          return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
        }
        if (lower.includes('gift') || lower.includes('voucher')) {
          return 'https://images.unsplash.com/photo-1612287233202-b51e3ed6c73c?auto=format&fit=crop&w=600&q=80';
        }
        return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
      };

      if (rawStoreData && rawStoreData.length > 0) {
        const enhancedStoreItems = rawStoreData.map(item => ({
          ...item,
          title: item.title || item.name || 'Vendor Digital Asset',
          description: item.description || item.details || 'Instant digital fulfillment available through your client account.',
          price: Number(item.price || item.cost || 0),
          category: item.category || item.type || 'Digital Asset',
          image_url: getImageForProduct(item.title || item.name || '', item.category || '', item.image_url || item.imageUrl || item.image)
        }));
        setStorefrontItems(enhancedStoreItems);
      } else {
        // Fallback default items if database is empty
        setStorefrontItems([
          {
            id: 'psn-100',
            title: 'PSN $100 CARD',
            description: 'Instant digital code delivery for your PSN Wallet. Region-free vendor digital asset.',
            price: 100.00,
            category: 'PSN Gift Cards',
            image_url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'psn-50',
            title: 'PSN $50 CARD',
            description: 'Top up your gaming library instantly with secure digital vendor fulfillment.',
            price: 50.00,
            category: 'PSN Gift Cards',
            image_url: 'https://images.unsplash.com/photo-1612287233202-b51e3ed6c73c?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'esim-tz',
            title: 'Tanzania 10GB Tourist eSIM',
            description: 'High-speed local network connection ready upon arrival with instant QR code delivery.',
            price: 46.00,
            category: 'Digital Essentials',
            image_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'
          }
        ]);
      }

      setLoadingStore(false);
      setLoading(false);
    };

    fetchUserHubData();
  }, [tier, userName]);

  // Apply tier filtering whenever userTier or list changes
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
      <div className="flex flex-col items-center justify-center py-32 gap-4 bg-black min-h-[70vh]">
        <Loader2 className="animate-spin text-amber-400" size={44} />
        <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80 animate-pulse">Syncing Secure Vault Credentials...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 bg-black min-h-screen flex items-center justify-center">
        <div className="bg-neutral-900/90 border border-amber-500/20 rounded-3xl p-8 text-center space-y-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-950 text-amber-300 border border-amber-700/60 px-3 py-1 rounded-full font-bold">
              Restricted Area
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Escape+ Vault Access</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This private client portal is reserved for verified travelers. Please sign in or register your account to access your itineraries and digital storefront.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <UserCheck size={16} /> Sign In to User Hub
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-slate-300 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider border border-neutral-700 shadow"
            >
              Return to Home
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
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-8 text-slate-100 bg-black min-h-screen">
      
      {/* Hero Welcome Header & Stat Cards */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-neutral-900/90 border border-amber-500/20 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-amber-400 font-mono tracking-wider">{initials}</span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-neutral-950 w-4 h-4 rounded-full shadow-md animate-pulse" title="Active Connection" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-inner">
              <Sparkles size={12} /> Escape+ Client Portal Active ({activeDisplayTier})
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100">{displayName}</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-lg leading-relaxed">
              Manage your custom Tanzanian safaris, monitor draft roadmap sessions, and oversee your travel credentials seamlessly.
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto relative z-10 shrink-0">
          <div className="bg-neutral-950/90 border border-neutral-800 px-4 py-3 rounded-2xl text-center shadow-inner hover:border-amber-500/50 transition">
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-0.5">Total Trips</span>
            <span className="text-xl font-black text-amber-400">{totalItineraries}</span>
          </div>
          <div className="bg-neutral-950/90 border border-neutral-800 px-4 py-3 rounded-2xl text-center shadow-inner hover:border-blue-500/50 transition">
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-0.5">Drafts</span>
            <span className="text-xl font-black text-blue-400">{draftSessions}</span>
          </div>
          <div className="bg-neutral-950/90 border border-neutral-800 px-4 py-3 rounded-2xl text-center shadow-inner hover:border-emerald-500/50 transition">
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-0.5">Confirmed</span>
            <span className="text-xl font-black text-emerald-400">{confirmedBookings}</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Itineraries & Live Lifestyle Hub Digital Storefront */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-gradient-to-r from-amber-950/60 via-neutral-900 to-neutral-900 border border-amber-800/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 text-center sm:text-left relative z-10">
              <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Zap size={18} className="text-amber-400" /> Ready for your next expedition?
              </h3>
              <p className="text-xs text-slate-300 font-medium">Design custom itineraries using live Serengeti & Zanzibar rates tailored to your tier.</p>
            </div>
            <a 
              href="/itinerary-builder" 
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 shrink-0 relative z-10"
            >
              Build New Trip <ArrowRight size={14} />
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Compass className="text-amber-400" size={20} />
                Saved Itineraries & Drafts ({activeDisplayTier})
              </h2>
              
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1 rounded-xl shadow-inner">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'all' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  All ({totalItineraries})
                </button>
                <button
                  onClick={() => handleFilterChange('draft')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'draft' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Drafts ({draftSessions})
                </button>
                <button
                  onClick={() => handleFilterChange('confirmed')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'confirmed' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Confirmed ({confirmedBookings})
                </button>
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-16 text-center space-y-4 backdrop-blur-md shadow-xl">
                <FileText className="mx-auto text-slate-500" size={56} />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Itineraries Match This Filter</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    You don't have any items under the <span className="text-amber-400 font-bold">{activeDisplayTier}</span> tier category. Build a brand new custom safari session to get started.
                  </p>
                </div>
                <a 
                  href="/itinerary-builder" 
                  className="inline-flex items-center gap-2 mt-4 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider shadow"
                >
                  Open Itinerary Builder →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredList.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all rounded-2xl p-6 space-y-4 flex flex-col justify-between group shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest bg-amber-950 text-amber-300 border border-amber-700/60 px-2.5 py-1 rounded-md font-black shadow-sm">
                          {item.tier || activeDisplayTier} TIER
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-black flex items-center gap-1.5 shadow-sm ${
                          item.status === 'confirmed' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                            : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                        }`}>
                          {item.status === 'confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.status || 'Draft Session'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title || 'Custom Safari Expedition'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> Tanzania Circuit</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        {item.total_days ? `${item.total_days} Mapped Days` : 'Custom Schedule'}
                      </span>
                      <a 
                        href={`/itinerary-builder?id=${item.id}`} 
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        Load Session <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lifestyle Hub Digital Storefront Section (Live Vendor DB Connected with Rich Visual Cards) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Gift className="text-amber-400" size={20} />
                Lifestyle Hub: Digital Storefront
              </h2>
              <div className="flex items-center gap-3">
                <a 
                  href="/lifestyle-hub" 
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  View All Hub <ExternalLink size={12} />
                </a>
                {cart.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                    <ShoppingBag size={12} /> Cart: {cart.length} item(s)
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Live vendor assets, digital gift cards, and exclusive items posted directly through your vendor inventory.
            </p>

            {loadingStore ? (
              <div className="py-12 text-center text-xs text-amber-400 font-mono flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Connecting to Vendor Storefront Database...
              </div>
            ) : storefrontItems.length === 0 ? (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <p>Digital storefront inventory is currently updating.</p>
                <p className="text-[11px] text-slate-300 font-mono">No active vendor items found in database tables.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {storefrontItems.map((prod) => (
                  <div key={prod.id || prod.title} className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg group">
                    
                    {/* Rich Visual Image Banner */}
                    <div className="w-full h-40 bg-neutral-950 relative overflow-hidden">
                      <img 
                        src={prod.image_url} 
                        alt={prod.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 shadow-md">
                          {prod.category || 'Vendor Asset'}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 shadow">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">{prod.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                        <span className="text-sm font-black text-amber-400 font-mono">${Number(prod.price || 0).toFixed(2)}</span>
                        <button 
                          onClick={() => handleAddToCart(prod)}
                          className="bg-neutral-800 hover:bg-amber-400 hover:text-slate-950 text-amber-400 border border-neutral-700 font-bold px-3 py-1.5 rounded-xl transition text-xs flex items-center gap-1.5 shadow"
                        >
                          <PlusCircle size={14} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial, Credentials & Concierge Summary Panel */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Active Account Status</span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={18} /> Verified Explorer
              </h3>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Residency Tier Level</span>
                <span className="font-extrabold text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-700/60 uppercase shadow-sm">{activeDisplayTier}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Gateway Encryption</span>
                <span className="font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700/60 shadow-sm">SECURE SSL</span>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">Travel Credentials</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Vault Synced</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="flex items-center gap-2"><FileCheck size={14} className="text-amber-400" /> Passport Verification</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">Verified</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="flex items-center gap-2"><FileCheck size={14} className="text-amber-400" /> Yellow Fever Cert</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">On File</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl space-y-3 shadow-inner">
              <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold block">Escape+ Concierge Services</span>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span>🚁 TCAA Drone Permit Support</span>
                  <span className="text-[10px] text-amber-400 font-bold">Active</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span>📶 eSIM Digital Handover</span>
                  <span className="text-[10px] text-amber-400 font-bold">Ready</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <a 
                href="https://wa.me/255666281717?text=Hello%20Escape%2B%20Tours,%20I%20would%20like%20assistance%20from%20the%20concierge."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 text-center bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider border border-emerald-800 shadow-md"
              >
                <MessageCircle size={14} /> Contact Dedicated Concierge
              </a>

              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 text-center bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider border border-red-800/60 shadow-md"
              >
                {loggingOut ? <Loader2 className="animate-spin" size={14} /> : <LogOut size={14} />}
                Log Out of User Hub (`UserDashboard.tsx`)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}