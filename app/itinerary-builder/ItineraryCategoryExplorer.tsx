// app/itinerary-builder/ItineraryCategoryExplorer.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useUser } from '@/components/providers/UserContext';
import { createClient } from '@/lib/supabase/client';
import { Search, Bed, Car, Mountain, MapPin, AlertCircle, Anchor, Compass, Loader2, Users, Minus, Plus, ShieldCheck, Check, Crown, PlusCircle, MinusCircle, Calendar, Filter, X, ChevronRight } from 'lucide-react';
import { getStandardizedPrice, ResidencyTier } from "@/lib/utils/price-translator";
import { BuilderItem, ItineraryItem } from '@/lib/types/itinerary-types';
import { mapDbItemsToBuilderItems } from '@/lib/utils/item-mapper';
import { useItineraryStore } from '@/store/useItineraryStore';

const CATEGORY_CONFIG = [
  { label: 'Lodges', dbType: 'lodges', icon: Bed, bgUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  { label: 'Activities', dbType: 'activities', icon: MapPin, bgUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80' },
  { label: 'Transport', dbType: 'transfers', icon: Car, bgUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80' },
  { label: 'Safaris', dbType: 'parks', icon: Compass, bgUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cruises', dbType: 'cruises', icon: Anchor, bgUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
  { label: 'Treks', dbType: 'treks', icon: Mountain, bgUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80' },
] as const;

const POPULAR_LOCATIONS = [
  'All', 
  'Serengeti', 
  'Ngorongoro', 
  'Zanzibar', 
  'Tarangire', 
  'Kilimanjaro', 
  'Mikumi', 
  'Dar',
  'Arusha',
  'Karatu',
  'Ruaha',
  'Nyerere (Selous)',
  'Lake Manyara',
  'Mahale',
  'Katavi',
  'Saadani',
  'Mafia Island'
];

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

  const resolvedLocation = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawLoc = (item as any).location || (item as any).destination || (item as any).region;
    if (rawLoc) return rawLoc;
    
    const combined = `${item.name} ${item.type || ''}`.toLowerCase();
    if (combined.includes('serengeti')) return 'Serengeti NP';
    if (combined.includes('ngorongoro')) return 'Ngorongoro Crater';
    if (combined.includes('zanzibar') || combined.includes('nungwi') || combined.includes('stone town')) return 'Zanzibar';
    if (combined.includes('tarangire')) return 'Tarangire NP';
    if (combined.includes('kilimanjaro') || combined.includes('marangu') || combined.includes('machame')) return 'Mt. Kilimanjaro';
    if (combined.includes('mikumi')) return 'Mikumi NP';
    if (combined.includes('dar')) return 'Dar es Salaam';
    if (combined.includes('ruaha')) return 'Ruaha NP';
    if (combined.includes('selous') || combined.includes('nyerere')) return 'Nyerere (Selous)';
    if (combined.includes('manyara')) return 'Lake Manyara';
    if (combined.includes('mahale')) return 'Mahale Mountains';
    if (combined.includes('katavi')) return 'Katavi NP';
    if (combined.includes('saadani')) return 'Saadani NP';
    if (combined.includes('mafia')) return 'Mafia Island';
    if (combined.includes('arusha')) return 'Arusha';
    if (combined.includes('karatu')) return 'Karatu';
    
    if (item.latitude && item.longitude) {
      return `${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°`;
    }
    
    return 'Tanzania';
  }, [item]);

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
        className={`group relative flex items-center justify-between p-3 border rounded-xl transition-all duration-300 cursor-grab active:cursor-grabbing bg-gradient-to-br from-stone-900/95 via-stone-950/98 to-zinc-950 backdrop-blur-2xl select-none shadow-xl overflow-hidden
        ${draggedId === item.id 
          ? 'opacity-40 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.25)] scale-[0.98]' 
          : 'border-amber-500/15 hover:border-amber-400/50 hover:bg-stone-900/95'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="flex items-center gap-3 overflow-hidden relative z-10 pr-2">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-stone-900 overflow-hidden flex-shrink-0 border border-amber-500/25 relative shadow-inner">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <AlertCircle size={15} className="m-auto text-amber-500/40" />
            )}
          </div>
          <div className="min-w-0 flex flex-col justify-center gap-1">
            <h4 className="font-serif font-bold text-stone-100 text-xs sm:text-sm tracking-wide line-clamp-1 leading-snug group-hover:text-amber-200 transition-colors">{item.name}</h4>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-block text-[9px] text-amber-400/90 uppercase tracking-[0.12em] font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/25">
                {item.type}
              </span>

              <span className="inline-flex items-center gap-1 text-[9px] text-stone-300 font-medium bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-800 tracking-wide">
                <MapPin size={9} className="text-amber-400 shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[140px]">{resolvedLocation}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          <span className="text-xs sm:text-sm font-serif font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
            {price != null ? `$${price.toLocaleString()}` : "Inquire"}
          </span>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowRemoveModal(true); }}
              title="Remove from Itinerary"
              className="p-2 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-stone-950 transition-all cursor-pointer shadow-md"
            >
              <MinusCircle size={15} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              onTouchEnd={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              title="Book / Add to Itinerary"
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 border border-amber-300 text-stone-950 transition-all cursor-pointer shadow-md"
            >
              <PlusCircle size={15} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-3 rounded-xl border border-amber-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5">
              <span className="text-[10px] font-serif uppercase tracking-[0.15em] text-amber-300 flex items-center gap-1 font-bold">
                <Crown size={12} className="text-amber-400" /> Book: {item.name}
              </span>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-amber-300 text-xs font-bold px-1.5 py-0.5 rounded-lg bg-stone-900 border border-amber-500/20 cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1 font-semibold">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-xs text-stone-100 outline-none focus:border-amber-400 font-bold cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1 font-semibold">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-xs text-stone-100 outline-none focus:border-amber-400 font-bold cursor-pointer">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer font-bold">Cancel</button>
              <button type="button" onClick={handleConfirmAdd} className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-[10px] font-serif font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-lg"><Check size={13} /> Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div 
          className="absolute inset-0 z-50 bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-3 rounded-xl border border-rose-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
              <span className="text-[10px] font-serif uppercase tracking-[0.15em] text-rose-300 flex items-center gap-1 font-bold">
                <Calendar size={12} className="text-rose-400" /> Revoke: {item.name}
              </span>
              <button type="button" onClick={() => setShowRemoveModal(false)} className="text-stone-400 hover:text-rose-300 text-xs font-bold px-1.5 py-0.5 rounded-lg bg-stone-900 border border-rose-500/20 cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1 font-semibold">Target Day</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-stone-900 border border-rose-500/40 rounded-xl px-2.5 py-1.5 text-xs text-stone-100 outline-none focus:border-rose-400 font-bold cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-serif uppercase tracking-wider text-stone-400 block mb-1 font-semibold">Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full bg-stone-900 border border-rose-500/40 rounded-xl px-2.5 py-1.5 text-xs text-stone-100 outline-none focus:border-rose-400 font-bold cursor-pointer">
                  {['Morning', 'Afternoon', 'Evening'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowRemoveModal(false)} className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-serif uppercase tracking-wider text-stone-400 hover:text-stone-200 cursor-pointer font-bold">Cancel</button>
              <button type="button" onClick={handleConfirmRemove} className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 text-[10px] font-serif font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-lg"><Check size={13} /> Confirm Removal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

InventoryItem.displayName = 'InventoryItem';

export interface ItineraryBuilderProps {
  tier?: ResidencyTier | string;
  residencyTier?: ResidencyTier;
  onSelectItem?: (item: ItineraryItem) => void;
  onAddItem?: (item: ItineraryItem) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRemoveItem?: (item: BuilderItem | any) => void;
  onTierChange?: (tier: ResidencyTier) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ItineraryBuilder = ({ tier: propTier, residencyTier: propResidencyTier, onSelectItem, onAddItem, onRemoveItem, isOpen: propIsOpen, onClose: propOnClose }: ItineraryBuilderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userContext = useUser() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeTier = useItineraryStore((state: any) => state.residencyTier || state.tier);
  
  const initialTier = propResidencyTier || propTier || storeTier || 'INTERNATIONAL';
  const [resolvedTier, setResolvedTier] = useState<string>(initialTier);
  const [loadingTier, setLoadingTier] = useState(!propResidencyTier && !propTier && !storeTier);

  // Studio-style collapsible drawer state
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propOnClose ? (val: boolean) => { if (!val) propOnClose(); } : setInternalIsOpen;

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
  const addItemStore = useItineraryStore((state: any) => state.addItem ?? state.addItemToTimeline ?? (() => {}));
  
  const [activeCategory, setActiveCategory] = useState<string>('Lodges');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('All');
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
    if (onAddItem) {
      onAddItem(formattedItem as unknown as ItineraryItem);
    } else if (onSelectItem) {
      onSelectItem(formattedItem as unknown as ItineraryItem);
    } else {
      addItemStore(formattedItem);
    }
  }, [addItemStore, onAddItem, onSelectItem]);

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

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeLocationFilter === 'All') return true;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawLoc = (i as any).location || (i as any).destination || (i as any).region || '';
      const fullText = `${i.name} ${i.type || ''} ${rawLoc}`.toLowerCase();
      
      if (activeLocationFilter === 'Nyerere (Selous)') {
        return fullText.includes('nyerere') || fullText.includes('selous');
      }

      if (activeLocationFilter === 'Dar') {
        return fullText.includes('dar') || fullText.includes('daressalaam');
      }

      if (activeLocationFilter === 'Arusha') {
        return fullText.includes('arusha') || fullText.includes('sakina');
      }

      if (activeLocationFilter === 'Karatu') {
        return fullText.includes('karatu');
      }
      
      return fullText.includes(activeLocationFilter.toLowerCase());
    });
  }, [items, search, activeLocationFilter]);

  if (!isOpen) {
    return (
      <div className="absolute right-4 top-24 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-950/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl text-amber-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:bg-amber-500/20 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <Compass size={16} className="text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-serif font-bold text-xs uppercase tracking-[0.15em]">Open Portfolio</span>
          <ChevronRight size={14} className="text-amber-400/70" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-stone-950 via-stone-950/98 to-zinc-950 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-amber-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100 relative">
      
      {/* Header & Controls Section */}
      <div className="p-3 border-b border-amber-500/15 space-y-2 bg-stone-900/90 backdrop-blur-xl flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-lg shadow-inner">
              <Crown size={13} className="text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-stone-100 text-xs uppercase tracking-[0.18em]">Curated Portfolio</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-950/90 rounded-lg border border-amber-500/30 shadow-inner">
              <ShieldCheck size={11} className="text-amber-400" />
              <span className="text-[9px] font-serif font-bold uppercase tracking-widest text-amber-300">
                {loadingTier ? 'SYNC...' : `${normalizedTier}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Close Portfolio Drawer"
              className="p-1.5 rounded-lg bg-stone-950/90 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer shadow-inner"
            >
              <X size={13} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
           <div className="flex items-center justify-between px-2.5 py-1 bg-stone-950/90 rounded-lg border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-1.5">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Adults</span>
             </div>
             <div className="flex items-center gap-1 bg-stone-900 px-1.5 py-0.5 rounded border border-amber-500/20">
               <button type="button" onClick={() => setGuests(Math.max(1, adults - 1), children)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Minus size={9}/></button>
               <span className="text-xs font-serif font-bold text-amber-300 min-w-[10px] text-center">{adults}</span>
               <button type="button" onClick={() => setGuests(adults + 1, children)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Plus size={9}/></button>
             </div>
           </div>

           <div className="flex items-center justify-between px-2.5 py-1 bg-stone-950/90 rounded-lg border border-amber-500/20 shadow-inner">
             <div className="flex items-center gap-1.5">
               <Users size={11} className="text-amber-400/80" />
               <span className="text-[9px] font-serif font-semibold text-stone-300 uppercase tracking-wider">Kids</span>
             </div>
             <div className="flex items-center gap-1 bg-stone-900 px-1.5 py-0.5 rounded border border-amber-500/20">
               <button type="button" onClick={() => setGuests(adults, Math.max(0, children - 1))} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Minus size={9}/></button>
               <span className="text-xs font-serif font-bold text-amber-300 min-w-[10px] text-center">{children}</span>
               <button type="button" onClick={() => setGuests(adults, children + 1)} className="text-stone-400 hover:text-amber-300 cursor-pointer p-0.5"><Plus size={9}/></button>
             </div>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2 text-amber-500/50" size={13} />
          <input 
            placeholder={`Search ${activeCategory.toLowerCase()} collection...`} 
            className="w-full pl-8 pr-3 py-1.5 bg-stone-950/90 rounded-xl text-xs text-stone-100 placeholder:text-stone-500 outline-none border border-amber-500/20 focus:border-amber-400/80 font-medium shadow-inner transition-colors" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Compact Category Switcher Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button 
                type="button"
                key={cat.label} 
                onClick={() => setActiveCategory(cat.label)} 
                className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-300 border overflow-hidden cursor-pointer ${
                  isActive 
                    ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)] bg-amber-950/50' 
                    : 'border-amber-500/15 hover:border-amber-400/40 bg-stone-950/60'
                }`}
              >
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isActive ? 'scale-110 opacity-40' : 'opacity-20 group-hover:opacity-30 group-hover:scale-105'}`}
                  style={{ backgroundImage: `url(${cat.bgUrl})` }}
                />
                
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/60' 
                    : 'bg-stone-950/80'
                }`} />

                <cat.icon size={13} className={`relative z-15 shrink-0 transition-all duration-300 ${isActive ? 'text-amber-300 scale-110' : 'text-amber-400/70 group-hover:text-amber-300'}`} /> 
                <span className={`relative z-15 text-[9px] font-serif uppercase tracking-wider transition-colors truncate ${isActive ? 'text-amber-200 font-bold' : 'text-stone-300 font-medium'}`}>
                  {cat.label}
                </span>

                {isActive && (
                  <div className="absolute bottom-0 inset-x-2 h-[2px] bg-amber-400 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Location Region Quick-Filters with Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-amber-500/10 whitespace-nowrap scrollbar-thin scrollbar-thumb-amber-500/20 select-auto">
          <div className="flex items-center gap-1 text-[8px] font-serif uppercase tracking-widest text-amber-400/60 shrink-0 pr-0.5">
            <Filter size={9} /> Regions:
          </div>
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = activeLocationFilter === loc;
            return (
              <button
                type="button"
                key={loc}
                onClick={() => setActiveLocationFilter(loc)}
                className={`px-2 py-0.5 rounded-full text-[8px] font-serif uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-md' 
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Inventory List with Fully Visible Bookable Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar min-h-0 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-amber-400/60">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-[10px] font-serif uppercase tracking-widest">Loading Collection...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-stone-500 text-center px-4">
            <AlertCircle size={24} className="text-amber-500/40" />
            <span className="text-xs font-serif uppercase tracking-wider">No matching items found</span>
            <span className="text-[9px] text-stone-600">Try adjusting your search query or region filter.</span>
          </div>
        ) : (
          filteredItems.map((item) => (
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
        )}
      </div>

    </div>
  );
};

export default ItineraryBuilder;