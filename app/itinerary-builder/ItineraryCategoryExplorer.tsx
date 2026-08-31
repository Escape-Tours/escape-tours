// components/itinerary/ItineraryBuilder.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useUser } from '@/components/providers/UserContext';
import { createClient } from '@/lib/supabase/client';
import { Search, Bed, Car, Mountain, MapPin, AlertCircle, Anchor, Compass, Loader2, Users, Minus, Plus, Sparkles, ShieldCheck, PlusCircle, MinusCircle, Calendar, Check, Crown } from 'lucide-react';
import { getStandardizedPrice, ResidencyTier } from "@/lib/utils/price-translator";
import { BuilderItem, ItineraryItem } from '@/lib/types/itinerary-types';
import { mapDbItemsToBuilderItems } from '@/lib/utils/item-mapper';
import CheckoutButton from 'components/itinerary/CheckoutButton';
import { useItineraryStore } from 'store/useItineraryStore';

const CATEGORY_CONFIG = [
  { label: 'Lodges', dbType: 'lodges', icon: Bed },
  { label: 'Activities', dbType: 'activities', icon: MapPin },
  { label: 'Transport', dbType: 'transfers', icon: Car },
  { label: 'Safaris', dbType: 'parks', icon: Compass },
  { label: 'Cruises', dbType: 'cruises', icon: Anchor },
  { label: 'Treks', dbType: 'treks', icon: Mountain },
] as const;

const InventoryItem = memo(({ item, onDragStart, onDragEnd, onQuickAdd, onQuickRemove, draggedId, tier }: { 
  item: BuilderItem; 
  onDragStart: (e: React.DragEvent, item: BuilderItem, resolvedPrice: number | null) => void;
  onDragEnd: () => void;
  onQuickAdd: (item: BuilderItem, targetDay: number, timeSlot: string, resolvedPrice: number | null) => void;
  onQuickRemove: (item: BuilderItem, targetDay: number, timeSlot: string) => void;
  draggedId: string | null;
  tier: ResidencyTier;
}) => {
  const price = useMemo(() => getStandardizedPrice(item.price, tier), [item.price, tier]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('Morning');

  const handleConfirmAdd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd(item, selectedDay, selectedSlot, price);
    setShowAddModal(false);
  };

  const handleConfirmRemove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickRemove(item, selectedDay, selectedSlot);
    setShowRemoveModal(false);
  };

  return (
    <div className="relative">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item, price)}
        onDragEnd={onDragEnd}
        className={`group relative flex items-center justify-between p-4 border rounded-[1.75rem] transition-all duration-500 cursor-grab active:cursor-grabbing bg-gradient-to-br from-stone-900/90 via-stone-950/95 to-zinc-950 backdrop-blur-2xl select-none shadow-2xl
          ${draggedId === item.id 
            ? 'opacity-40 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.2)] scale-[0.98]' 
            : 'border-amber-500/15 hover:border-amber-400/50 hover:bg-stone-900/95 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}`}
      >
        <div className="flex items-center gap-3.5 overflow-hidden relative z-10 pr-2">
          <div className="h-14 w-14 rounded-2xl bg-stone-900 overflow-hidden flex-shrink-0 border border-amber-500/20 relative shadow-inner group-hover:border-amber-400/50 transition-colors duration-300">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <AlertCircle size={18} className="m-auto text-amber-500/40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-medium text-stone-100 text-[13px] tracking-wide line-clamp-1 leading-snug group-hover:text-amber-200 transition-colors">{item.name}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block text-[9px] text-amber-400/90 uppercase tracking-[0.2em] font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {item.type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 flex-shrink-0 relative z-10">
          <span className="text-xs font-serif font-bold text-amber-300 bg-gradient-to-r from-amber-500/15 to-amber-600/10 px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-inner">
            {price != null ? `$${price.toLocaleString()}` : "Inquire"}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              title="Remove from Itinerary"
              className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-stone-950 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <MinusCircle size={15} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              title="Add to Itinerary"
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-stone-950 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <PlusCircle size={15} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-3.5 rounded-[1.75rem] border border-amber-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-amber-300 flex items-center gap-1.5">
                <Crown size={13} className="text-amber-400" /> Curate Schedule
              </span>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-lg bg-stone-900 border border-amber-500/20 cursor-pointer transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-amber-500/30 rounded-xl px-2.5 py-2 text-xs text-stone-200 outline-none focus:border-amber-400 font-medium cursor-pointer shadow-inner">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-amber-500/30 rounded-xl px-2.5 py-2 text-xs text-stone-200 outline-none focus:border-amber-400 font-medium cursor-pointer shadow-inner">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer transition-colors">Cancel</button>
              <button type="button" onClick={handleConfirmAdd} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-[10px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"><Check size={13} /> Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-3.5 rounded-[1.75rem] border border-rose-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-rose-300 flex items-center gap-1.5">
                <Calendar size={13} className="text-rose-400" /> Revoke Slot
              </span>
              <button type="button" onClick={() => setShowRemoveModal(false)} className="text-stone-400 hover:text-rose-300 text-xs font-bold px-2 py-0.5 rounded-lg bg-stone-900 border border-rose-500/20 cursor-pointer transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-rose-500/30 rounded-xl px-2.5 py-2 text-xs text-stone-200 outline-none focus:border-rose-400 font-medium cursor-pointer shadow-inner">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-rose-500/30 rounded-xl px-2.5 py-2 text-xs text-stone-200 outline-none focus:border-rose-400 font-medium cursor-pointer shadow-inner">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowRemoveModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer transition-colors">Cancel</button>
              <button type="button" onClick={handleConfirmRemove} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-stone-950 text-[10px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"><Check size={13} /> Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

InventoryItem.displayName = 'InventoryItem';

interface ItineraryBuilderProps {
  tier?: ResidencyTier | string;
  residencyTier?: ResidencyTier;
  onSelectItem?: (item: ItineraryItem) => void;
  onRemoveItem?: (item: BuilderItem | any) => void;
}

export const ItineraryBuilder = ({ tier: propTier, residencyTier: propResidencyTier, onSelectItem, onRemoveItem }: ItineraryBuilderProps) => {
  const userContext = useUrlUserContextWithFallback() as any;
  const storeTier = useItineraryStore((state: any) => state.residencyTier || state.tier);
  
  const initialTier = propResidencyTier || propTier || storeTier || 'INTERNATIONAL';
  const [resolvedTier, setResolvedTier] = useState<string>(initialTier);
  const [loadingTier, setLoadingTier] = useState(!propResidencyTier && !propTier && !storeTier);

  useEffect(() => {
    const activeProp = propResidencyTier || propTier || storeTier;
    if (activeProp) {
      setResolvedTier(activeProp);
      setLoadingTier(false);
    }
  }, [propResidencyTier, propTier, storeTier]);

  const syncUserHubTier = useCallback(async () => {
    if (propResidencyTier || propTier || storeTier) return;
    try {
      const localStoredTier = localStorage.getItem('escape_user_tier') || localStorage.getItem('residency_tier');
      if (localStoredTier) {
        setResolvedTier(String(localStoredTier).toUpperCase());
        setLoadingTier(false);
        return;
      }
      const ctxTier = userContext?.tier || userContext?.residencyTier;
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
      }
    } catch (err) {
      console.error('Error syncing tier:', err);
    } finally {
      setLoadingTier(false);
    }
  }, [propResidencyTier, propTier, storeTier, userContext]);

  useEffect(() => {
    if (!propResidencyTier && !propTier && !storeTier) {
      syncUserHubTier();
    }
  }, [propResidencyTier, propTier, storeTier, syncUserHubTier]);

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
  const addItemStore = useItineraryStore((state: any) => state.addItem ?? state.addItemToTimeline ?? (() => {}));
  const removeItemStore = useItineraryStore((state: any) => state.removeItem ?? state.removeItemFromTimeline ?? (() => {}));

  const { baseTotal, totalPrice } = useMemo(() => {
    if (!storeItems || storeItems.length === 0) return { baseTotal: 0, totalPrice: 0 };
    let base = 0;
    let total = 0;
    storeItems.forEach((item: any) => {
      const activeLocalizedPrice = Number(getStandardizedPrice(item.price ?? item.basePrice, normalizedTier)) || Number(item.price) || 0;
      const quantity = Number(item.quantity ?? item.slots ?? 1);
      const subtotalBase = activeLocalizedPrice * quantity;
      base += subtotalBase;
      total += (subtotalBase + (subtotalBase * 0.18) + (subtotalBase * 0.20));
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

  const handleDragStart = useCallback((e: React.DragEvent, item: BuilderItem, resolvedPrice: number | null) => {
    setDraggedItemId(item.id);
    const dragData = { 
      originalId: item.id, 
      id: item.id,
      name: item.name, 
      type: item.type, 
      price: resolvedPrice ?? item.price, 
      basePrice: resolvedPrice ?? item.price, 
      image_url: item.image_url,
      latitude: item.latitude,
      longitude: item.longitude,
      day: 1,
      slot: 'Morning',
      timeSlot: 'Morning'
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  }, []);

  const handleQuickAdd = useCallback((item: BuilderItem, targetDay: number = 1, timeSlot: string = 'Morning', resolvedPrice: number | null) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
    const finalItemPrice = resolvedPrice ?? item.price;
    const formattedItem = {
      originalId: item.id,
      id: item.id,
      name: item.name,
      type: item.type,
      price: finalItemPrice,
      basePrice: finalItemPrice,
      image_url: item.image_url,
      latitude: item.latitude,
      longitude: item.longitude,
      quantity: 1,
      day: targetDay,
      slot: timeSlot,
      timeSlot: timeSlot
    };
    if (onSelectItem) {
      onSelectItem(formattedItem as unknown as ItineraryItem);
    } else {
      addItemStore(formattedItem);
    }
  }, [addItemStore, onSelectItem]);

  const handleQuickRemove = useCallback((item: BuilderItem, targetDay: number = 1, timeSlot: string = 'Morning') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    const storeState = useItineraryStore.getState() as any;
    const currentItems = storeState?.items || [];
    
    const updatedItems = currentItems.filter((i: any) => {
      const matchesId = String(i.id) === String(item.id) || String(i.originalId) === String(item.id) || String(i.id) === String(item.originalId);
      const itemDay = Number(i.day ?? i.targetDay ?? 1);
      const matchesDay = itemDay === Number(targetDay);
      const rawItemSlot = String(i.slot || i.timeSlot || 'Morning').trim().toLowerCase();
      const matchesSlot = rawItemSlot === String(timeSlot).trim().toLowerCase();
      
      // If it matches ID, Day, and Slot, filter it out (remove it)
      if (matchesId && matchesDay && matchesSlot) {
        return false;
      }
      return true;
    });

    // Check all possible store setters to guarantee state updates
    if (storeState && typeof storeState.setItems === 'function') {
      storeState.setItems(updatedItems);
    } else if (storeState && typeof storeState.removeItem === 'function') {
      storeState.removeItem(item.id);
    } else if (typeof removeItemStore === 'function') {
      removeItemStore(item.id);
    }

    if (onRemoveItem) {
      onRemoveItem({
        ...item,
        day: targetDay,
        targetDay,
        slot: timeSlot,
        timeSlot
      });
    }
  }, [removeItemStore, onRemoveItem]);

  const filteredItems = useMemo(() => 
    items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), 
  [items, search]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-stone-950 via-stone-950/98 to-zinc-950 backdrop-blur-3xl rounded-[2.5rem] border border-amber-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100">
      
      {/* Top Header & Filters Section */}
      <div className="p-4 border-b border-amber-500/15 space-y-3 bg-stone-900/80 backdrop-blur-xl flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-xl shadow-inner">
              <Crown size={13} className="text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-stone-100 text-[11px] uppercase tracking-[0.25em]">Curated Portfolio</h2>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-950/90 rounded-xl border border-amber-500/30 shadow-inner">
            <ShieldCheck size={11} className="text-amber-400" />
            <span className="text-[9px] font-serif font-bold uppercase tracking-widest text-amber-300">
              {loadingTier ? 'SYNCING...' : `${normalizedTier} PRIVILEGE`}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
           <div className="flex items-center justify-between px-3 py-1.5 bg-stone-950/90 rounded-xl border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-2">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Adults</span>
             </div>
             <div className="flex items-center gap-1.5 bg-stone-900 px-2 py-0.5 rounded-lg border border-amber-500/20">
               <button type="button" onClick={() => setGuests(Math.max(1, adults - 1), children)} className="text-stone-400 hover:text-amber-300 cursor-pointer transition-colors"><Minus size={10}/></button>
               <span className="text-[10px] font-serif font-bold text-amber-300 min-w-[12px] text-center">{adults}</span>
               <button type="button" onClick={() => setGuests(adults + 1, children)} className="text-stone-400 hover:text-amber-300 cursor-pointer transition-colors"><Plus size={10}/></button>
             </div>
           </div>

           <div className="flex items-center justify-between px-3 py-1.5 bg-stone-950/90 rounded-xl border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-2">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Kids</span>
             </div>
             <div className="flex items-center gap-1.5 bg-stone-900 px-2 py-0.5 rounded-lg border border-amber-500/20">
               <button type="button" onClick={() => setGuests(adults, Math.max(0, children - 1))} className="text-stone-400 hover:text-amber-300 cursor-pointer transition-colors"><Minus size={10}/></button>
               <span className="text-[10px] font-serif font-bold text-amber-300 min-w-[12px] text-center">{children}</span>
               <button type="button" onClick={() => setGuests(adults, children + 1)} className="text-stone-400 hover:text-amber-300 cursor-pointer transition-colors"><Plus size={10}/></button>
             </div>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 text-amber-500/50" size={14} />
          <input 
            placeholder={`Search ${activeCategory.toLowerCase()} collection...`} 
            className="w-full pl-9 pr-3.5 py-2 bg-stone-950/90 rounded-xl text-xs text-stone-100 placeholder:text-stone-500 outline-none border border-amber-500/20 focus:border-amber-400/80 font-medium shadow-inner transition-colors" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button 
                type="button"
                key={cat.label} 
                onClick={() => setActiveCategory(cat.label)} 
                className={`flex flex-col items-center gap-1 p-2 min-w-[62px] rounded-xl transition-all duration-300 border cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 border-amber-300 font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.03]' 
                    : 'bg-stone-950/60 border-amber-500/15 text-stone-400 hover:bg-stone-900 hover:text-stone-200 font-medium'
                }`}
              >
                <cat.icon size={14} className={isActive ? 'text-stone-950' : 'text-amber-400/80'} /> 
                <span className="text-[9px] font-serif tracking-wide">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory List Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-amber-500/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-amber-400" size={24} />
            <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-stone-500">Accessing Archives...</span>
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
              onQuickAdd={handleQuickAdd}
              onQuickRemove={handleQuickRemove}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <p className="text-xs font-serif text-stone-400">No bespoke items found in this tier</p>
          </div>
        )}
      </div>

      {/* Subtotal & Checkout Section */}
      <div className="p-4 bg-stone-900/95 border-t border-amber-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative space-y-2.5 flex-shrink-0 z-10 backdrop-blur-2xl">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-serif font-medium text-stone-400 uppercase tracking-wider">Subtotal (Exclusive)</span>
          <span className="font-serif font-bold text-stone-200">${baseTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-amber-500/10">
          <div>
            <span className="text-[9px] font-serif font-bold uppercase tracking-[0.2em] text-amber-300 block">Total Portfolio Value</span>
            <span className="text-[9px] text-stone-400 font-light">Inclusive of luxury levies & VAT</span>
          </div>
          <span className="text-xl font-serif font-bold text-amber-400 tracking-tight drop-shadow-sm">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
        
        <CheckoutButton 
          amount={totalPrice} 
          itineraryId="pending-id" 
          className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-serif font-bold uppercase text-xs tracking-[0.2em] py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(251,191,36,0.3)] border border-amber-300/40" 
        />
      </div>
    </div>
  );
};

function useUrlUserContextWithFallback() {
  try {
    return useUser();
  } catch {
    return null;
  }
}

export default ItineraryBuilder;