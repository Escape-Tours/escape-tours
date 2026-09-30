// components/hub/UserDashboard.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  FileText, 
  Clock, 
  Loader2, 
  ArrowRight, 
  MapPin, 
  Calendar,
  Sparkles,
  ExternalLink,
  Lock,
  UserCheck,
  MessageCircle,
  ShoppingBag,
  Zap,
  Car,
  PhoneCall,
  Radio,
  Send,
  ShieldCheck,
  CreditCard,
  RadioTower,
  PlusCircle,
  LogOut
} from 'lucide-react';

interface UserDashboardProps {
  tier?: string;
  userName?: string;
}

const fallbackPopularLocations: string[] = [
  'Arusha City Center',
  'Kilimanjaro International Airport (JRO)',
  'Serengeti National Park (Seronera)',
  'Ngorongoro Crater Conservation Area',
  'Mikumi National Park Gate',
  'Zanzibar Stone Town',
  'Zanzibar International Airport (ZNZ)'
];

export default function UserDashboard({ tier = 'INTERNATIONAL', userName }: UserDashboardProps) {
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Digital Storefront State & PesaPal Checkout Integration
  const [storefrontItems, setStorefrontItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Live Database-Driven Ride Dispatcher State & Nationwide Locations Autocomplete
  const [popularLocations, setPopularLocations] = useState<string[]>(fallbackPopularLocations);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  const [selectedRideType, setSelectedRideType] = useState<'cruiser' | 'vipsuv' | 'minibus'>('cruiser');
  const [dispatchState, setDispatchState] = useState<'idle' | 'searching' | 'matched' | 'arrived' | 'payment_pending'>('idle');
  const [activeRideId, setActiveRideId] = useState<string | null>(null);
  const [activeRideAmount, setActiveRideAmount] = useState<number>(300);
  const [assignedDriver, setAssignedDriver] = useState<any>(null);
  const [rideMessages, setRideMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [fleetVehicles, setFleetVehicles] = useState<any[]>([]);

  // TCAA Drone & Permit Packages State
  const [dronePackages, setDronePackages] = useState<any[]>([
    { 
      id: 'drone-avata-2', 
      name: 'DJI Avata 2 Explorer Bundle', 
      desc: 'Includes Fly More Combo + TCAA Import Permit & Local Registration Support', 
      price: 1150.00, 
      permit_cost: '$250 TCAA Fee Included',
      image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 'drone-mavic-3-pro', 
      name: 'DJI Mavic 3 Pro Cinematic Package', 
      desc: 'Triple-camera setup + National Park Aerial Filming Authorization', 
      price: 2450.00, 
      permit_cost: '$350 TCAA & Park Permit Included',
      image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80' 
    }
  ]);
  const [purchasingDroneId, setPurchasingDroneId] = useState<string | null>(null);

  const activeDisplayTier = userTier.toUpperCase();

  // Dynamic route-based multiplier calculation
  const getRouteMultiplier = (pickup: string, dropoff: string) => {
    const text = (pickup + ' ' + dropoff).toLowerCase();
    if (text.includes('serengeti') || text.includes('ngorongoro') || text.includes('ruaha') || text.includes('lemala') || text.includes('kubukubu')) {
      return 1.8;
    }
    if (text.includes('kilimanjaro') || text.includes('tarangire') || text.includes('manyara') || text.includes('arusha safari')) {
      return 1.4;
    }
    if (text.includes('airport') || text.includes('jro') || text.includes('znz') || text.includes('dar')) {
      return 1.2;
    }
    return 1.0;
  };

  const routeMultiplier = getRouteMultiplier(pickupLocation, dropoffLocation);

  const rideOptions = [
    {
      id: 'cruiser',
      name: 'Safari Land Cruiser V8',
      desc: 'Pop-up roof wildlife viewing, 4x4 reinforced',
      eta: '4 mins away',
      price: Math.round(300 * routeMultiplier),
      icon: '🚙'
    },
    {
      id: 'vipsuv',
      name: 'VIP Executive Transfer',
      desc: 'Climate controlled luxury SUV for city & airport',
      eta: '2 mins away',
      price: Math.round(80 * routeMultiplier),
      icon: '🚘'
    },
    {
      id: 'minibus',
      name: 'Group Safari Sprinter',
      desc: 'Spacious seating for up to 10 explorers',
      eta: '7 mins away',
      price: Math.round(200 * routeMultiplier),
      icon: '🚐'
    }
  ];

  // Close custom dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupDropdown(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const user = session.user;
      setCurrentUser(user);
      const userId = user.id;

      const metaAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
      if (metaAvatar) setAvatarUrl(metaAvatar);

      const { data: profile } = await (supabase.from('profiles' as any) as any)
        .select('*')
        .eq('id', userId)
        .single();
      
      const dbTier = 
        profile?.residency_tier || 
        profile?.tier || 
        profile?.residency || 
        user.user_metadata?.residency_tier || 
        user.user_metadata?.tier || 
        tier;

      setUserTier(dbTier.toUpperCase());

      if (profile?.avatar_url && !metaAvatar) {
        setAvatarUrl(profile.avatar_url);
      }

      const resolvedName = 
        profile?.full_name || 
        profile?.name || 
        profile?.username ||
        user.user_metadata?.full_name || 
        user.user_metadata?.name || 
        user.user_metadata?.first_name ||
        (user.email ? user.email.split('@')[0] : 'Valued Explorer');

      setDisplayName(resolvedName);

      // Fetch nationwide locations & lodges directly from Supabase `locations` table
      const { data: dbLocations, error: locError } = await (supabase.from('locations' as any) as any)
        .select('name')
        .order('name', { ascending: true });

      if (dbLocations && !locError && dbLocations.length > 0) {
        const uniqueLocs = Array.from(new Set(dbLocations.map((l: any) => l.name ? String(l.name).trim() : ''))) as string[];
        setPopularLocations(uniqueLocs);
      } else {
        setPopularLocations(fallbackPopularLocations);
      }

      // Fetch itineraries
      const { data: itineraries, error } = await (supabase.from('itineraries' as any) as any)
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (itineraries && !error) {
        setItineraryList(itineraries);
        applyTierAndFilter(itineraries, dbTier, activeFilter);
      }

      // Fetch Live Fleet Vehicles strictly from database
      const { data: dbFleet } = await (supabase.from('fleet_vehicles' as any) as any)
        .select('*');
      if (dbFleet && dbFleet.length > 0) {
        setFleetVehicles(dbFleet);
      }

      // Check for active ongoing ride for this user in Supabase
      const { data: activeRides } = await (supabase.from('rides' as any) as any)
        .select('*')
        .eq('user_id', userId)
        .in('status', ['searching', 'matched', 'arrived', 'payment_pending'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (activeRides && activeRides.length > 0) {
        const liveRide = activeRides[0];
        setActiveRideId(liveRide.id);
        setPickupLocation(liveRide.pickup_location);
        setDropoffLocation(liveRide.dropoff_location);
        setDispatchState(liveRide.status);
        if (liveRide.amount) {
          setActiveRideAmount(Number(liveRide.amount));
        }
        if (liveRide.driver_data) {
          setAssignedDriver(liveRide.driver_data);
        }
      }

      // Storefront fetch logic
      let rawStoreData: any[] | null = null;
      const { data: primaryStore } = await (supabase.from('lifestyle_hub_items' as any) as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (primaryStore && primaryStore.length > 0) {
        rawStoreData = primaryStore;
      } else {
        const { data: fallbackStore } = await (supabase.from('storefront_items' as any) as any)
          .select('*')
          .order('created_at', { ascending: false });
        if (fallbackStore) rawStoreData = fallbackStore;
      }

      const getImageForProduct = (title: string, category: string, existingImage?: string) => {
        if (existingImage && existingImage.startsWith('http')) return existingImage;
        const lower = (title + ' ' + category).toLowerCase();
        if (lower.includes('psn') || lower.includes('playstation') || lower.includes('card')) {
          return 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&q=80';
        }
        if (lower.includes('esim') || lower.includes('data') || lower.includes('tanzania') || lower.includes('sim')) {
          return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
        }
        return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
      };

      if (rawStoreData && rawStoreData.length > 0) {
        const enhancedStoreItems = rawStoreData.map((item: any) => ({
          ...item,
          title: item.title || item.name || 'Vendor Digital Asset',
          description: item.description || item.details || 'Instant digital fulfillment available through your client account.',
          price: Number(item.price || item.cost || 0),
          category: item.category || item.type || 'Digital Asset',
          image_url: getImageForProduct(item.title || item.name || '', item.category || '', item.image_url || item.imageUrl || item.image)
        }));
        setStorefrontItems(enhancedStoreItems);
      } else {
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

  // Real-time Supabase subscriptions for live ride acceptance & updates from the Driver Portal
  useEffect(() => {
    if (!activeRideId) return;
    const supabase = createClient();

    const fetchMessages = async () => {
      const { data } = await (supabase.from('ride_messages' as any) as any)
        .select('*')
        .eq('ride_id', activeRideId)
        .order('created_at', { ascending: true });
      if (data) setRideMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`public:rides:id=eq.${activeRideId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${activeRideId}`
        },
        (payload: any) => {
          const updated = payload.new;
          if (updated) {
            setDispatchState(updated.status);
            if (updated.amount) {
              setActiveRideAmount(Number(updated.amount));
            }
            if (updated.driver_data) {
              setAssignedDriver(updated.driver_data);
            }
          }
        }
      )
      .subscribe();

    const chatChannel = supabase
      .channel(`public:ride_messages:ride_id=eq.${activeRideId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ride_messages',
          filter: `ride_id=eq.${activeRideId}`
        },
        (payload: any) => {
          if (payload.new) {
            setRideMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(chatChannel);
    };
  }, [activeRideId]);

  const applyTierAndFilter = (list: any[], currentTier: string, filter: 'all' | 'draft' | 'confirmed') => {
    const targetTier = currentTier.toUpperCase();
    const validItineraries = list.filter((item: any) => 
      !item.tier || item.tier.toUpperCase() === targetTier
    );

    setTotalItineraries(validItineraries.length);
    const drafts = validItineraries.filter((item: any) => item.status === 'draft' || item.status === 'secured' || !item.status);
    const booked = validItineraries.filter((item: any) => item.status === 'confirmed');
    
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

  const handlePesaPalCheckout = async () => {
    if (cart.length === 0) return;
    setProcessingCheckout(true);

    try {
      const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
      const response = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'USD',
          description: `Escape+ Storefront Order: ${cart.map(i => i.title).join(', ')}`,
          email: currentUser?.email || 'explorer@escapetourstz.com',
          first_name: displayName.split(' ')[0] || 'Valued',
          last_name: displayName.split(' ').slice(1).join(' ') || 'Explorer',
          phone_number: currentUser?.phone || '+255666281717',
          items: cart
        })
      });

      const data = await response.json();
      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data.error || 'Failed to generate PesaPal redirect URL');
      }
    } catch (err: any) {
      console.error('PesaPal checkout error:', err);
      setProcessingCheckout(false);
      alert(err.message || 'An error occurred during payment initialization.');
    }
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

  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation || !currentUser) return;

    setDispatchState('searching');
    const supabase = createClient();
    const selectedTierObj = rideOptions.find(o => o.id === selectedRideType) || rideOptions[0];
    setActiveRideAmount(selectedTierObj.price);

    const { data: newRide, error } = await (supabase.from('rides' as any) as any).insert({
      user_id: currentUser.id,
      user_name: displayName,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      ride_type: selectedRideType,
      amount: selectedTierObj.price,
      status: 'searching'
    }).select().single();

    if (error) {
      console.error('Supabase Ride Insert Error:', error);
      alert('Failed to broadcast dispatch request. Please verify your Supabase rides table schema.');
      setDispatchState('idle');
      return;
    }

    if (newRide) {
      setActiveRideId(newRide.id);
      if (newRide.amount) {
        setActiveRideAmount(Number(newRide.amount));
      }
    }
  };

  const handleProceedToPesaPalPayment = async () => {
    const selectedTierObj = rideOptions.find(o => o.id === selectedRideType) || rideOptions[0];
    const finalChargeAmount = activeRideAmount || selectedTierObj.price;

    try {
      setDispatchState('payment_pending');
      const response = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalChargeAmount,
          currency: 'USD',
          description: `Safari Fleet Transfer: ${selectedTierObj.name} from ${pickupLocation} to ${dropoffLocation}`,
          email: currentUser?.email || 'explorer@escapetourstz.com',
          first_name: displayName.split(' ')[0] || 'Valued',
          last_name: displayName.split(' ').slice(1).join(' ') || 'Explorer',
          phone_number: currentUser?.phone || '+255666281717'
        })
      });

      const data = await response.json();
      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data.error || 'Failed to generate PesaPal redirect URL');
      }
    } catch (err: any) {
      console.error('Ride dispatch PesaPal error:', err);
      setDispatchState('matched');
      alert(err.message || 'Failed to initialize vehicle dispatch payment.');
    }
  };

  const handleCancelDispatch = async () => {
    if (activeRideId) {
      const supabase = createClient();
      await (supabase.from('rides' as any) as any)
        .update({ status: 'cancelled' })
        .eq('id', activeRideId);
    }
    setDispatchState('idle');
    setAssignedDriver(null);
    setActiveRideId(null);
    setRideMessages([]);
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !activeRideId || !currentUser) return;
    const supabase = createClient();
    await (supabase.from('ride_messages' as any) as any).insert({
      ride_id: activeRideId,
      sender_id: currentUser.id,
      sender_name: displayName,
      message: newMessageText.trim()
    });
    setNewMessageText('');
  };

  const handlePurchaseDronePackage = async (dronePkg: any) => {
    setPurchasingDroneId(dronePkg.id);
    try {
      const response = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: dronePkg.price || 1150.00,
          currency: 'USD',
          description: `TCAA Compliant Drone Hardware & Permit Package: ${dronePkg.name}`,
          email: currentUser?.email || 'explorer@escapetourstz.com',
          first_name: displayName.split(' ')[0] || 'Valued',
          last_name: displayName.split(' ').slice(1).join(' ') || 'Explorer',
          phone_number: currentUser?.phone || '+255666281717'
        })
      });

      const data = await response.json();
      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data.error || 'Failed to initialize drone package checkout.');
      }
    } catch (err: any) {
      console.error('Drone package checkout error:', err);
      setPurchasingDroneId(null);
      alert(err.message || 'An error occurred during payment initialization.');
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
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-slate-300 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider border border-neutral-800 shadow"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = displayName && displayName !== 'Valued Explorer' && displayName !== 'Loading...'
    ? displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'EX';

  const filteredPickupLocations = Array.from(new Set(
    popularLocations.map(loc => loc.trim()).filter(loc => loc.toLowerCase().includes(pickupLocation.toLowerCase()))
  )) as string[];
  if (pickupLocation.trim() && !filteredPickupLocations.some(l => l.toLowerCase() === pickupLocation.toLowerCase())) {
    filteredPickupLocations.unshift(pickupLocation.trim());
  }

  const filteredDropoffLocations = Array.from(new Set(
    popularLocations.map(loc => loc.trim()).filter(loc => loc.toLowerCase().includes(dropoffLocation.toLowerCase()))
  )) as string[];
  if (dropoffLocation.trim() && !filteredDropoffLocations.some(l => l.toLowerCase() === dropoffLocation.toLowerCase())) {
    filteredDropoffLocations.unshift(dropoffLocation.trim());
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 space-y-8 text-slate-100 bg-black min-h-screen">
      
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
              Manage your custom Tanzanian safaris, dispatch instant live fleet vehicles with secure PesaPal checkout, and acquire TCAA compliant aerial equipment.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
          <a
            href="https://wa.me/255666281717?text=Hello%20Escape%20Tours%20Concierge,%20I%20need%20assistance%20with%20my%20safari%20itinerary."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-2xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-500/50"
          >
            <MessageCircle size={16} /> WhatsApp Concierge
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-slate-300 hover:text-white font-bold px-4 py-3 rounded-2xl transition text-xs uppercase tracking-wider border border-neutral-800 flex items-center justify-center gap-2 shadow"
          >
            {loggingOut ? <Loader2 className="animate-spin" size={14} /> : <LogOut size={14} />} Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TWO-WAY DRIVER DISPATCHER */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                  <Radio size={10} className="animate-pulse text-emerald-400" /> Two-Way Driver Portal & Hub Sync
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Car className="text-amber-400" size={22} /> Where to, Explorer?
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                Live Fleet: <strong className="text-emerald-400">Drivers Online</strong>
              </span>
            </div>

            {/* STATE 1: IDLE */}
            {dispatchState === 'idle' && (
              <div className="space-y-5 relative z-10">
                <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                  
                  {/* Pickup Input */}
                  <div className="space-y-1 relative" ref={pickupRef}>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Pickup Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400 z-10">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter pickup location (e.g., Dar es Salaam Serena Hotel)"
                        value={pickupLocation}
                        onChange={(e) => {
                          setPickupLocation(e.target.value);
                          setShowPickupDropdown(true);
                        }}
                        onFocus={() => setShowPickupDropdown(true)}
                        className="w-full bg-neutral-900 text-white placeholder-slate-500 text-xs sm:text-sm pl-10 pr-4 py-3.5 rounded-xl border border-neutral-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    {showPickupDropdown && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-900 border border-amber-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {filteredPickupLocations.map((loc, idx) => (
                          <button
                            key={`pickup-${loc}-${idx}`}
                            type="button"
                            onClick={() => {
                              setPickupLocation(loc);
                              setShowPickupDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 transition flex items-center gap-2 border-b border-neutral-800/50 last:border-0"
                          >
                            <MapPin size={12} className="text-amber-400 shrink-0" />
                            <span>{loc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dropoff Input */}
                  <div className="space-y-1 relative" ref={dropoffRef}>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Destination / Dropoff Lodge</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400 z-10">
                        <Compass size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter destination lodge (e.g., Hellen's Lodge)"
                        value={dropoffLocation}
                        onChange={(e) => {
                          setDropoffLocation(e.target.value);
                          setShowDropoffDropdown(true);
                        }}
                        onFocus={() => setShowDropoffDropdown(true)}
                        className="w-full bg-neutral-900 text-white placeholder-slate-500 text-xs sm:text-sm pl-10 pr-4 py-3.5 rounded-xl border border-neutral-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    {showDropoffDropdown && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-900 border border-amber-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {filteredDropoffLocations.map((loc, idx) => (
                          <button
                            key={`dropoff-${loc}-${idx}`}
                            type="button"
                            onClick={() => {
                              setDropoffLocation(loc);
                              setShowDropoffDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 transition flex items-center gap-2 border-b border-neutral-800/50 last:border-0"
                          >
                            <Compass size={12} className="text-amber-400 shrink-0" />
                            <span>{loc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Ride Selection Cards with Dynamic Route-Based Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Select Fleet Vehicle Tier</label>
                    {routeMultiplier > 1.0 && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        Route Multiplier Active ({routeMultiplier}x Safari Circuit)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {rideOptions.map((ride) => {
                      const isSelected = selectedRideType === ride.id;
                      return (
                        <div
                          key={ride.id}
                          onClick={() => setSelectedRideType(ride.id as any)}
                          className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col justify-between gap-3 relative overflow-hidden ${
                            isSelected 
                              ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10' 
                              : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{ride.icon}</span>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                              ${ride.price}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">{ride.name}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{ride.desc}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 pt-1 border-t border-neutral-900">
                            <Clock size={10} /> {ride.eta}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleRequestRide}
                  disabled={!pickupLocation || !dropoffLocation}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> Broadcast Dispatch to Driver Portal (${rideOptions.find(o => o.id === selectedRideType)?.price || 300})
                </button>
              </div>
            )}

            {/* STATE 2: SEARCHING */}
            {dispatchState === 'searching' && (
              <div className="py-16 text-center space-y-4 relative z-10">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 shadow-lg">
                    <Radio size={24} className="animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">Broadcasting to Driver Portals...</h4>
                  <p className="text-xs text-slate-400">Waiting for a real driver to accept your ride request in their portal dashboard.</p>
                </div>
                <button
                  onClick={handleCancelDispatch}
                  className="bg-neutral-800 hover:bg-neutral-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Cancel Request
                </button>
              </div>
            )}

            {/* STATE 3: MATCHED */}
            {(dispatchState === 'matched' || dispatchState === 'arrived' || dispatchState === 'payment_pending') && (
              <div className="space-y-6 relative z-10 bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
                      <Car size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                        Driver Accepted Your Dispatch!
                      </span>
                      <h4 className="text-base font-black text-white">{assignedDriver?.name || 'Verified Safari Driver'}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400">Assigned Plate</span>
                    <p className="text-sm font-mono font-bold text-amber-400">{assignedDriver?.plate || 'T 892 DZM'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Driver Contact</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{assignedDriver?.phone || '+255 714 892 100'}</span>
                      <a 
                        href={`tel:${assignedDriver?.phone || '+255714892100'}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition text-xs font-bold flex items-center gap-1.5"
                      >
                        <PhoneCall size={14} /> Call Driver
                      </a>
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Final Step: Secure Checkout</span>
                    <button
                      onClick={handleProceedToPesaPalPayment}
                      disabled={dispatchState === 'payment_pending'}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2.5 rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      {dispatchState === 'payment_pending' ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />}
                      Pay via PesaPal (${activeRideAmount})
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                    <MessageCircle size={12} /> Secure Direct Dispatch Chat
                  </span>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 h-32 overflow-y-auto space-y-2 text-xs">
                    {rideMessages.length === 0 ? (
                      <p className="text-slate-500 text-center py-8 font-mono">Chat initialized with your driver. Send pickup instructions or lodge notes.</p>
                    ) : (
                      rideMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender_id === currentUser?.id ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] font-mono text-slate-500 mb-0.5">{msg.sender_name || 'User'}</span>
                          <div className={`p-2.5 rounded-xl max-w-[80%] ${msg.sender_id === currentUser?.id ? 'bg-amber-500 text-neutral-950 font-medium' : 'bg-neutral-800 text-slate-200'}`}>
                            {msg.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message to your driver..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1"
                    >
                      <Send size={14} /> Send
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleCancelDispatch}
                    className="text-xs text-rose-400 hover:text-rose-300 underline font-mono"
                  >
                    Cancel Booking
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* TCAA COMPLIANT DRONE HARDWARE & PERMIT RETAIL STORE */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950 border border-amber-700/60 text-amber-300 text-[10px] font-mono font-bold uppercase">
                  <ShieldCheck size={10} className="text-amber-400" /> TCAA Permitted Hardware Retail
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <RadioTower className="text-amber-400" size={22} /> DJI Drone & Permit Bundles
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                Fulfillment: <strong className="text-emerald-400">Instant Vendor Processing</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {dronePackages.map((pkg) => (
                <div key={pkg.id} className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition group">
                  <div className="relative h-40 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                    <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur border border-amber-500/40 text-amber-400 text-[10px] font-mono px-2.5 py-1 rounded-lg">
                      {pkg.permit_cost}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{pkg.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pkg.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                    <span className="text-base font-mono font-bold text-amber-400">${pkg.price.toFixed(2)}</span>
                    <button
                      onClick={() => handlePurchaseDronePackage(pkg)}
                      disabled={purchasingDroneId === pkg.id}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                    >
                      {purchasingDroneId === pkg.id ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />}
                      Order Bundle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ITINERARIES & BOOKINGS VAULT */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Client Itineraries & Safaris</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="text-amber-400" size={20} /> Saved Expeditions
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'all' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  All ({totalItineraries})
                </button>
                <button
                  onClick={() => handleFilterChange('draft')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'draft' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Drafts ({draftSessions})
                </button>
                <button
                  onClick={() => handleFilterChange('confirmed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'confirmed' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Confirmed ({confirmedBookings})
                </button>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              {filteredList.length === 0 ? (
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                    <Compass size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">No Itineraries Found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">You haven't built or saved any itineraries under the {activeDisplayTier} tier yet. Use our Safari Builder to create your custom Tanzanian adventure.</p>
                  </div>
                  <button
                    onClick={() => router.push('/itinerary-builder')}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
                  >
                    Open Safari Builder <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                filteredList.map((item: any) => (
                  <div key={item.id} className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-6 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-widest bg-neutral-900 text-amber-400 border border-neutral-800 px-2.5 py-1 rounded-lg font-bold">
                          {item.tier || activeDisplayTier} Tier
                        </span>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-lg font-bold ${
                          item.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        }`}>
                          {item.status || 'Draft Session'}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white group-hover:text-amber-400 transition">
                        {item.title || item.name || `Safari Expedition #${item.id}`}
                      </h4>
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-amber-400" /> {item.duration || '7 Days'}</span>
                        <span className="flex items-center gap-1"><Compass size={12} className="text-amber-400" /> {item.destination || 'Serengeti & Ngorongoro'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => router.push(`/itinerary-builder?id=${item.id}`)}
                        className="flex-1 md:flex-initial bg-neutral-900 hover:bg-neutral-800 text-slate-200 hover:text-white font-bold px-5 py-3 rounded-xl transition text-xs uppercase tracking-wider border border-neutral-800 flex items-center justify-center gap-2"
                      >
                        View Itinerary <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Digital Storefront */}
        <div className="space-y-8">
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Lifestyle Hub & Vendor Goods</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ShoppingBag className="text-amber-400" size={20} /> Digital Storefront
                </h3>
              </div>
              <span className="text-xs font-mono bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-slate-300">
                Cart: <strong className="text-amber-400">{cart.length}</strong>
              </span>
            </div>

            <div className="space-y-4 relative z-10 max-h-[420px] overflow-y-auto pr-1">
              {loadingStore ? (
                <div className="py-12 text-center">
                  <Loader2 className="animate-spin text-amber-400 mx-auto" size={28} />
                </div>
              ) : storefrontItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No storefront items currently available.</p>
              ) : (
                storefrontItems.map((item) => (
                  <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-amber-500/50 transition group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-black text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                      <span className="text-xs font-mono font-bold text-amber-400">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold p-3 rounded-xl transition border border-amber-500/40 shrink-0"
                      title="Add to Cart"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-800 space-y-3 relative z-10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Total Cart Value:</span>
                  <span className="text-amber-400 font-bold">
                    ${cart.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handlePesaPalCheckout}
                  disabled={processingCheckout}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black py-3.5 rounded-2xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {processingCheckout ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                  Checkout via PesaPal
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}