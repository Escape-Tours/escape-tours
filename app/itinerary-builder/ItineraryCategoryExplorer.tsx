'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useUser } from '@/components/providers/UserContext';
import { createClient } from '@/lib/supabase/client';
import { Search, Bed, Car, Mountain, MapPin, AlertCircle, Anchor, Compass, Loader2, Users, Minus, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { getStandardizedPrice, ResidencyTier } from "@/lib/utils/price-translator";
import { BuilderItem } from '@/lib/types/itinerary-types';
import { mapDbItemsToBuilderItems } from '@/lib/utils/item-mapper';
import CheckoutButton from 'components/itinerary/CheckoutButton';
import { useItineraryStore } from 'store/useItineraryStore';

const CATEGORY_CONFIG = [
  { label: 'Lodges', dbType: 'lodges', icon: Bed, bg: 'bg-indigo-50/80', activeBg: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25', border: 'border-indigo-100/60', text: 'text-indigo-600' },
  { label: 'Activities', dbType: 'activities', icon: MapPin, bg: 'bg-emerald-50/80', activeBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25', border: 'border-emerald-100/60', text: 'text-emerald-600' },
  { label: 'Transport', dbType: 'transfers', icon: Car, bg: 'bg-orange-50/80', activeBg: 'bg-orange-600 text-white shadow-lg shadow-orange-500/25', border: 'border-orange-100/60', text: 'text-orange-600' },
  { label: 'Safaris', dbType: 'parks', icon: Compass, bg: 'bg-amber-50/80', activeBg: 'bg-amber-600 text-white shadow-lg shadow-amber-500/25', border: 'border-amber-100/60', text: 'text-amber-600' },
  { label: 'Cruises', dbType: 'cruises', icon: Anchor, bg: 'bg-blue-50/80', activeBg: 'bg-blue-600 text-white shadow-lg shadow-blue-500/25', border: 'border-blue-100/60', text: 'text-blue-600' },
  { label: 'Treks', dbType: 'treks', icon: Mountain, bg: 'bg-rose-50/80', activeBg: 'bg-rose-600 text-white shadow-lg shadow-rose-500/25', border: 'border-rose-100/60', text: 'text-rose-600' },
] as const;

const InventoryItem = memo(({ item, onDragStart, onDragEnd, draggedId, tier }: { 
  item: BuilderItem; 
  onDragStart: (e: React.DragEvent, item: BuilderItem) => void;
  onDragEnd: () => void;
  draggedId: string | null;
  tier: ResidencyTier;
}) => {
  const price = useMemo(() => getStandardizedPrice(item.price, tier), [item.price, tier]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center justify-between p-3.5 border rounded-2xl transition-all duration-300 cursor-grab active:cursor-grabbing bg-slate-900/40 backdrop-blur-md
        ${draggedId === item.id 
          ? 'opacity-40 border-amber-500 shadow-2xl scale-[0.97] rotate-1' 
          : 'border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:-translate-y-0.5'}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-center gap-3.5 overflow-hidden relative z-10">
        <div className="h-12 w-12 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0 border border-slate-800/80 relative shadow-inner">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <AlertCircle size={18} className="m-auto text-slate-600" />
          )}
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="min-w-0 pr-1">
          <h4 className="font-bold text-slate-100 text-xs line-clamp-2 leading-snug tracking-tight group-hover:text-amber-300 transition-colors">{item.name}</h4>
          <span className="inline-block mt-1 text-[9px] text-slate-400 uppercase tracking-widest font-extrabold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
            {item.type}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end flex-shrink-0 relative z-10 pl-2">
        <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 shadow-sm group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
          {price != null ? `$${price.toLocaleString()}` : "Inquire"}
        </span>
      </div>
    </div>
  );
});

InventoryItem.displayName = 'InventoryItem';

interface ItineraryBuilderProps {
  tier?: string;
  residencyTier?: string;
}

export const ItineraryBuilder = ({ tier: propTier, residencyTier: propResidencyTier }: ItineraryBuilderProps) => {
  const userContext = useUser() as any;
  const initialTier = propResidencyTier || propTier || 'INTERNATIONAL';
  const [resolvedTier, setResolvedTier] = useState<string>(initialTier);
  const [loadingTier, setLoadingTier] = useState(!propResidencyTier && !propTier);

  useEffect(() => {
    const activeProp = propResidencyTier || propTier;
    if (activeProp) {
      setResolvedTier(activeProp);
      setLoadingTier(false);
    }
  }, [propResidencyTier, propTier]);

  const syncUserHubTier = useCallback(async () => {
    if (propResidencyTier || propTier) return;
    try {
      const localStoredTier = localStorage.getItem('escape_user_tier') || localStorage.getItem('residency_tier') || sessionStorage.getItem('residency_tier');
      if (localStoredTier) {
        setResolvedTier(String(localStoredTier).toUpperCase());
        setLoadingTier(false);
        return;
      }

      const ctxTier = userContext?.tier || userContext?.residencyTier || userContext?.profile?.tier || userContext?.profile?.residency_tier;
      if (ctxTier) {
        setResolvedTier(String(ctxTier).toUpperCase());
        setLoadingTier(false);
        return;
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const metaTier = session.user.user_metadata?.residency_tier || session.user.user_metadata?.tier;
        if (metaTier) {
          setResolvedTier(String(metaTier).toUpperCase());
          setLoadingTier(false);
          return;
        }

        const { data: profile } = await (supabase.from('profiles' as any) as any)
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const dbFoundTier = profile.residency_tier || profile.tier || profile.category || profile.account_type;
          if (dbFoundTier) {
            setResolvedTier(String(dbFoundTier).toUpperCase());
            setLoadingTier(false);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Error syncing profile tier from User Hub:', err);
    } finally {
      setLoadingTier(false);
    }
  }, [propResidencyTier, propTier, userContext]);

  useEffect(() => {
    if (!propResidencyTier && !propTier) {
      syncUserHubTier();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (!propResidencyTier && !propTier && (e.key === 'escape_user_tier' || e.key === 'residency_tier')) {
        if (e.newValue) setResolvedTier(e.newValue.toUpperCase());
      }
    };

    const handleCustomTierUpdate = (e: Event) => {
      if (!propResidencyTier && !propTier) {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.tier) {
          setResolvedTier(String(customEvent.detail.tier).toUpperCase());
        } else {
          syncUserHubTier();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-tier-updated', handleCustomTierUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-tier-updated', handleCustomTierUpdate);
    };
  }, [propResidencyTier, propTier, syncUserHubTier]);

  const rawNormalized = resolvedTier.toLowerCase();
  const normalizedTier: ResidencyTier = rawNormalized.includes('citizen') 
    ? 'CITIZEN' 
    : rawNormalized.includes('resident') 
    ? 'RESIDENT' 
    : 'INTERNATIONAL';
  
  const adults = useItineraryStore((state: any) => state.adults ?? 1);
  const children = useItineraryStore((state: any) => state.children ?? 0);
  const setGuests = useItineraryStore((state: any) => state.setGuests ?? (() => {}));
  const storeItems = useItineraryStore((state: any) => state.items ?? []);

  const { baseTotal, totalPrice } = useMemo(() => {
    if (!storeItems || storeItems.length === 0) return { baseTotal: 0, totalPrice: 0 };
    
    let base = 0;
    let total = 0;

    storeItems.forEach((item: any) => {
      const localizedPrice = Number(getStandardizedPrice(item.price, normalizedTier)) || 0;
      const quantity = Number(item.quantity ?? item.slots ?? 1);
      const subtotalBase = localizedPrice * quantity;
      
      base += subtotalBase;
      
      const vatAmount = subtotalBase * 0.18;
      const agencyFeeAmount = subtotalBase * 0.20;
      total += (subtotalBase + vatAmount + agencyFeeAmount);
    });

    return { baseTotal: base, totalPrice: total };
  }, [storeItems, normalizedTier]);
  
  const [activeCategory, setActiveCategory] = useState<string>('Lodges');
  const [items, setItems] = useState<BuilderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  
  const cache = useRef<Record<string, BuilderItem[]>>({});

  const fetchData = useCallback(async () => {
    if (cache.current[activeCategory]) {
      setItems(cache.current[activeCategory]);
      return;
    }
    setLoading(true);
    const config = CATEGORY_CONFIG.find(c => c.label === activeCategory);
    if (config) {
      const { data } = await createClient().from('inventory').select('*').eq('type', config.dbType);
      
      if (data) {
        const transformed = mapDbItemsToBuilderItems(data);
        cache.current[activeCategory] = transformed;
        setItems(transformed);
      }
    }
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDragStart = useCallback((e: React.DragEvent, item: BuilderItem) => {
    setDraggedItemId(item.id);
    const dragData = { 
      originalId: item.id, 
      id: item.id,
      name: item.name, 
      type: item.type, 
      price: item.price, 
      basePrice: item.price, 
      image_url: item.image_url,
      latitude: item.latitude,
      longitude: item.longitude 
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  }, []);

  const filteredItems = useMemo(() => 
    items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), 
  [items, search]);

  return (
    <div className="flex flex-col h-full bg-slate-950/95 backdrop-blur-2xl rounded-3xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden text-slate-100">
      
      {/* Header Panel */}
      <div className="p-5 border-b border-slate-800/80 space-y-4 bg-slate-900/80 sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
            </div>
            <h2 className="font-black text-slate-100 text-xs uppercase tracking-[0.2em]">Inventory Library</h2>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800/80 shadow-inner">
            <ShieldCheck size={13} className="text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">
              {loadingTier ? 'SYNCING...' : `${normalizedTier} TIER LOCKED`}
            </span>
          </div>
        </div>
        
        {/* Guest Counters */}
        <div className="grid grid-cols-2 gap-2.5">
           <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-sm hover:border-slate-700 transition-colors">
             <div className="flex items-center gap-2">
               <Users size={12} className="text-amber-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adults</span>
             </div>
             <div className="flex items-center gap-2.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
               <button 
                type="button"
                onClick={() => setGuests(Math.max(1, adults - 1), children)}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
               >
                <Minus size={12}/>
               </button>
               <span className="text-[11px] font-black text-amber-300 min-w-[12px] text-center">{adults}</span>
               <button 
                type="button"
                onClick={() => setGuests(adults + 1, children)}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
               >
                <Plus size={12}/>
               </button>
             </div>
           </div>

           <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-sm hover:border-slate-700 transition-colors">
             <div className="flex items-center gap-2">
               <Users size={12} className="text-amber-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kids</span>
             </div>
             <div className="flex items-center gap-2.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
               <button 
                type="button"
                onClick={() => setGuests(adults, Math.max(0, children - 1))}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
               >
                <Minus size={12}/>
               </button>
               <span className="text-[11px] font-black text-amber-300 min-w-[12px] text-center">{children}</span>
               <button 
                type="button"
                onClick={() => setGuests(adults, children + 1)}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
               >
                <Plus size={12}/>
               </button>
             </div>
           </div>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-3 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={14} />
          <input 
            placeholder={`Search ${activeCategory.toLowerCase()}...`} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 rounded-2xl text-xs text-slate-100 placeholder:text-slate-600 outline-none border border-slate-800 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Category Navigation Pills */}
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button 
                type="button"
                key={cat.label} 
                onClick={() => setActiveCategory(cat.label)} 
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-300 border cursor-pointer ${
                  isActive 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black scale-[1.02]' 
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:border-slate-700 font-bold'
                }`}
              >
                <cat.icon size={16} className={isActive ? 'text-slate-950' : 'text-amber-400'} /> 
                <span className="text-[10px] tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory Items Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-amber-400" size={28} />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Loading Inventory...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <InventoryItem 
              key={item.id} 
              item={item} 
              tier={normalizedTier} 
              draggedId={draggedItemId} 
              onDragStart={handleDragStart} 
              onDragEnd={() => setDraggedItemId(null)} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-500">
              <Search size={20} />
            </div>
            <p className="text-xs font-bold text-slate-300">No items found</p>
            <p className="text-[10px] text-slate-500 mt-1">Try adjusting your search criteria or category filter.</p>
          </div>
        )}
      </div>

      {/* Footer / Total Quote Bar */}
      <div className="p-5 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-xl shadow-2xl relative space-y-3">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Subtotal (Before Tax)</span>
          <span className="font-bold text-slate-200">${baseTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 block">Total Quote</span>
            <span className="text-[11px] text-slate-500">Includes all taxes & fees</span>
          </div>
          <span className="text-xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
        
        <CheckoutButton 
          amount={totalPrice} 
          itineraryId="pending-id" 
          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black tracking-wider uppercase text-xs py-3.5 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 hover:scale-[1.01] cursor-pointer" 
        />
      </div>
    </div>
  );
};

export default ItineraryBuilder;