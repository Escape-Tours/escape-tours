// components/itinerary/ItineraryBuilder.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useUser } from '@/components/providers/UserContext';
import { createClient } from '@/lib/supabase/client';
import { Search, Bed, Car, Mountain, MapPin, AlertCircle, Anchor, Compass, Loader2, Users, Minus, Plus, ShieldCheck, PlusCircle, MinusCircle, Calendar, Check, Crown } from 'lucide-react';
import { getStandardizedPrice, ResidencyTier } from "@/lib/utils/price-translator";
import { BuilderItem, ItineraryItem } from '@/lib/types/itinerary-types';
import { mapDbItemsToBuilderItems } from '@/lib/utils/item-mapper';
import CheckoutButton from '@/components/itinerary/CheckoutButton';
import { useItineraryStore } from '@/store/useItineraryStore';

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
        className={`group relative flex items-center justify-between p-3 sm:p-3.5 border rounded-2xl transition-all duration-300 cursor-grab active:cursor-grabbing bg-gradient-to-br from-stone-900/95 via-stone-950/98 to-zinc-950 backdrop-blur-2xl select-none shadow-lg
          ${draggedId === item.id 
            ? 'opacity-40 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.2)] scale-[0.98]' 
            : 'border-amber-500/15 hover:border-amber-400/50 hover:bg-stone-900/95'}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden relative z-10 pr-2">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-stone-900 overflow-hidden flex-shrink-0 border border-amber-500/20 relative shadow-inner">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <AlertCircle size={14} className="m-auto text-amber-500/40" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-medium text-stone-100 text-[11px] sm:text-xs tracking-wide line-clamp-1 leading-snug">{item.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block text-[7px] sm:text-[8px] text-amber-400/90 uppercase tracking-[0.15em] font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                {item.type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 flex-shrink-0 relative z-10">
          <span className="text-[10px] sm:text-[11px] font-serif font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
            {price != null ? `$${price.toLocaleString()}` : "Inquire"}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              title="Remove from Itinerary"
              className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-stone-950 transition-all cursor-pointer"
            >
              <MinusCircle size={14} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              title="Add to Itinerary"
              className="p-2 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-stone-950 transition-all cursor-pointer"
            >
              <PlusCircle size={14} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-3 rounded-2xl border border-amber-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5">
              <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-amber-300 flex items-center gap-1">
                <Crown size={11} className="text-amber-400" /> Curate Schedule
              </span>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-stone-900 border border-amber-500/20 cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] font-serif uppercase tracking-wider text-stone-400 block mb-0.5">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-200 outline-none focus:border-amber-400 font-medium cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[8px] font-serif uppercase tracking-wider text-stone-400 block mb-0.5">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-200 outline-none focus:border-amber-400 font-medium cursor-pointer">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-0.5">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[9px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer">Cancel</button>
              <button type="button" onClick={handleConfirmAdd} className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-[9px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-md"><Check size={12} /> Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-3 rounded-2xl border border-rose-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
              <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-rose-300 flex items-center gap-1">
                <Calendar size={11} className="text-rose-400" /> Revoke Slot
              </span>
              <button type="button" onClick={() => setShowRemoveModal(false)} className="text-stone-400 hover:text-rose-300 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-stone-900 border border-rose-500/20 cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] font-serif uppercase tracking-wider text-stone-400 block mb-0.5">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-rose-500/30 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-200 outline-none focus:border-rose-400 font-medium cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[8px] font-serif uppercase tracking-wider text-stone-400 block mb-0.5">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-rose-500/30 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-200 outline-none focus:border-rose-400 font-medium cursor-pointer">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-0.5">
              <button type="button" onClick={() => setShowRemoveModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[9px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer">Cancel</button>
              <button type="button" onClick={handleConfirmRemove} className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 text-[9px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-md"><Check size={12} /> Remove</button>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRemoveItem?: (item: BuilderItem | any) => void;
}

export const ItineraryBuilder = ({ tier: propTier, residencyTier: propResidencyTier, onSelectItem, onRemoveItem }: ItineraryBuilderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userContext = useUrlUserContextWithFallback() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      void syncUserHubTier();
    }
  }, [propResidencyTier, propTier, storeTier, syncUserHubTier]);

  const rawNormalized = resolvedTier.toLowerCase();
  const normalizedTier: ResidencyTier = rawNormalized.includes('citizen') 
    ? 'CITIZEN' 
    : rawNormalized.includes('resident') 
    ? 'RESIDENT' 
    : 'INTERNATIONAL';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adults = useItineraryStore((state: any) => state.adults ?? 1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children = useItineraryStore((state: any) => state.children ?? 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setGuests = useItineraryStore((state: any) => state.setGuests ?? (() => {}));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeItems = useItineraryStore((state: any) => state.items ?? []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addItemStore = useItineraryStore((state: any) => state.addItem ?? state.addItemToTimeline ?? (() => {}));

  const { totalPrice } = useMemo(() => {
    if (!storeItems || storeItems.length === 0) return { baseTotal: 0, totalPrice: 0 };
    let base = 0;
    let total = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  useEffect(() => { void fetchData(); }, [fetchData]);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storeState = useItineraryStore.getState() as any;
    const currentItems = storeState?.items || [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedItems = currentItems.filter((i: any) => {
      const matchesId = 
        String(i.id) === String(item.id) || 
        String(i.originalId) === String(item.id) || 
        String(i.id) === String(i.originalId) ||
        String(i.instanceId) === String(item.id) ||
        String(i.uniqueId) === String(item.id);

      const itemDay = Number(i.day ?? i.targetDay ?? i.dayNumber ?? 1);
      const matchesDay = itemDay === Number(targetDay);
      
      const rawItemSlot = String(i.slot || i.timeSlot || i.period || 'Morning').trim().toLowerCase();
      const matchesSlot = rawItemSlot === String(timeSlot).trim().toLowerCase();
      
      return !(matchesId && matchesDay && matchesSlot);
    });

    if (storeState) {
      if (typeof storeState.setItems === 'function') {
        storeState.setItems(updatedItems);
      }
      if (typeof storeState.removeItemFromTimeline === 'function') {
        storeState.removeItemFromTimeline(item.id, targetDay, timeSlot);
      }
      if (typeof storeState.removeItem === 'function') {
        storeState.removeItem(item.id);
      }
      if (typeof storeState.removeTimelineItem === 'function') {
        storeState.removeTimelineItem(item.id, targetDay, timeSlot);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('itinerary:item-removed', { 
        detail: { id: item.id, day: targetDay, slot: timeSlot } 
      }));
      window.dispatchEvent(new CustomEvent('timeline:item-removed', { 
        detail: { id: item.id, day: targetDay, slot: timeSlot } 
      }));
    }

    if (onRemoveItem) {
      onRemoveItem({
        ...item,
        id: item.id,
        day: targetDay,
        targetDay,
        slot: timeSlot,
        timeSlot
      } as unknown as BuilderItem);
    }
  }, [onRemoveItem]);

  const filteredItems = useMemo(() => 
    items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), 
  [items, search]);

  return (
    <div className="flex flex-col h-full min-h-[75vh] md:min-h-0 bg-gradient-to-b from-stone-950 via-stone-950/98 to-zinc-950 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-amber-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100 pb-24 md:pb-0">
      
      <div className="p-3.5 sm:p-4 border-b border-amber-500/15 space-y-3 bg-stone-900/90 backdrop-blur-xl flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-xl shadow-inner">
              <Crown size={13} className="text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-stone-100 text-xs uppercase tracking-[0.2em]">Curated Portfolio</h2>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-stone-950/90 rounded-lg border border-amber-500/30 shadow-inner">
            <ShieldCheck size={11} className="text-amber-400" />
            <span className="text-[8px] sm:text-[9px] font-serif font-bold uppercase tracking-widest text-amber-300">
              {loadingTier ? 'SYNC...' : `${normalizedTier}`}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
           <div className="flex items-center justify-between px-3 py-1.5 bg-stone-950/90 rounded-xl border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-1.5">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Adults</span>
             </div>
             <div className="flex items-center gap-1.5 bg-stone-900 px-2 py-0.5 rounded-lg border border-amber-500/20">
               <button type="button" onClick={() => setGuests(Math.max(1, adults - 1), children)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Minus size={10}/></button>
               <span className="text-[11px] font-serif font-bold text-amber-300 min-w-[12px] text-center">{adults}</span>
               <button type="button" onClick={() => setGuests(adults + 1, children)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Plus size={10}/></button>
             </div>
           </div>

           <div className="flex items-center justify-between px-3 py-1.5 bg-stone-950/90 rounded-xl border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-1.5">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Kids</span>
             </div>
             <div className="flex items-center gap-1.5 bg-stone-900 px-2 py-0.5 rounded-lg border border-amber-500/20">
               <button type="button" onClick={() => setGuests(adults, Math.max(0, children - 1))} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Minus size={10}/></button>
               <span className="text-[11px] font-serif font-bold text-amber-300 min-w-[12px] text-center">{children}</span>
               <button type="button" onClick={() => setGuests(adults, children + 1)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Plus size={10}/></button>
             </div>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-amber-500/50" size={14} />
          <input 
            placeholder={`Search ${activeCategory.toLowerCase()} collection...`} 
            className="w-full pl-9 pr-3 py-2 bg-stone-950/90 rounded-xl text-xs text-stone-100 placeholder:text-stone-500 outline-none border border-amber-500/20 focus:border-amber-400/80 font-medium shadow-inner transition-colors" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Scrollable category selection tabs explicitly visible on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button 
                type="button"
                key={cat.label} 
                onClick={() => setActiveCategory(cat.label)} 
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all duration-300 border cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 border-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]' 
                    : 'bg-stone-950/60 border-amber-500/15 text-stone-400 hover:bg-stone-900 hover:text-stone-200 font-medium'
                }`}
              >
                <cat.icon size={16} className={isActive ? 'text-stone-950' : 'text-amber-400/80'} /> 
                <span className="text-[10px] font-serif tracking-wide">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-[360px] overflow-y-auto p-3.5 sm:p-4 space-y-3 scrollbar-thin scrollbar-thumb-amber-500/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
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
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-xs font-serif text-stone-400">No bespoke items found in this tier</p>
          </div>
        )}
      </div>

      {/* Super Compact, Minimalist Pinned Checkout & Totals Bar relocated to the bottom */}
      <div className="px-3.5 py-2.5 bg-stone-900/95 border-t border-amber-500/20 flex items-center justify-between gap-2 flex-shrink-0 z-30 backdrop-blur-xl shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-serif font-bold uppercase tracking-[0.15em] text-amber-400/80">Total</span>
          <span className="text-xs sm:text-sm font-serif font-bold text-amber-300 tracking-tight">
            ${totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="scale-90 sm:scale-100 origin-right">
          <CheckoutButton 
            amount={totalPrice} 
            itineraryId="pending-id" 
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold uppercase text-[9px] tracking-[0.15em] py-1.5 px-3.5 rounded-lg transition-all duration-300 cursor-pointer shadow-md border border-amber-300/40 text-center flex items-center justify-center gap-1" 
          />
        </div>
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