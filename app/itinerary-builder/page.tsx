// app/itinerary-builder/page.tsx
'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useItineraryStore } from 'store/useItineraryStore';
import ItineraryCategoryExplorer from './ItineraryCategoryExplorer';
import DayCard from '@/components/itinerary/DayCard';
import AIAssistantDrawer from '@/components/itinerary/AIAssistantDrawer';
import { Save, Sparkles, Compass, Plus, Layers, MapPin, CheckCircle2, Loader2, Bot, ShoppingCart, Lock, Download, ChevronLeft, ChevronRight, CreditCard, Share2, Activity, AlertTriangle, Trash2, X, Receipt, Info, Truck } from 'lucide-react';
import { saveItinerary } from '@/lib/services/itineraryService';
import { validatePayload } from '@/lib/services/stagingValidator';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/constants/index';
import { supabase } from '@/lib/supabase/client';
import { analyzeItineraryPace } from '@/lib/services/itineraryAnalyzer';

const ItineraryMapOverlay = dynamic(() => import('@/components/itinerary/ItineraryMapOverlay'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-950 animate-pulse rounded-3xl" />
});

const getBaseRateForTier = (item: ItineraryItem | null, tier: ResidencyTier): number => {
  if (!item) return 0;
  
  let val: any = null;
  if (tier === 'CITIZEN') {
    val = (item as any).citizen_price ?? (item as any).ea_price ?? (item as any).local_price ?? item.price ?? item.base_price;
  } else if (tier === 'RESIDENT') {
    val = (item as any).resident_price ?? item.price ?? item.base_price;
  } else {
    val = (item as any).international_price ?? item.price ?? item.base_price;
  }
  
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

const getParkCoordinates = (name: string): { lat: number; lng: number; region: 'NORTHERN' | 'SOUTHERN' | 'ZANZIBAR' | 'COASTAL' } => {
  const lower = name.toLowerCase();
  
  if (lower.includes('arusha') || lower.includes('tulia') || lower.includes('kikuletwa') || lower.includes('meru')) {
    return { lat: -3.3667, lng: 36.6833, region: 'NORTHERN' };
  }
  if (lower.includes('kilimanjaro') || lower.includes('moshi')) return { lat: -3.3333, lng: 37.3333, region: 'NORTHERN' };
  
  if (lower.includes('marera') || lower.includes('karatu') || lower.includes('ngorongoro') || lower.includes('hellen')) {
    return { lat: -3.3429, lng: 35.6713, region: 'NORTHERN' };
  }
  
  if (lower.includes('serengeti') || lower.includes('balloon') || lower.includes('dougg') || lower.includes('seronera')) {
    return { lat: -2.3333, lng: 34.8333, region: 'NORTHERN' };
  }
  if (lower.includes('tarangire')) return { lat: -3.8353, lng: 36.0125, region: 'NORTHERN' };
  if (lower.includes('manyara')) return { lat: -3.5704, lng: 35.8175, region: 'NORTHERN' };
  
  if (lower.includes('ruaha')) return { lat: -7.5000, lng: 34.9167, region: 'SOUTHERN' };
  if (lower.includes('selous') || lower.includes('nyerere')) return { lat: -7.8333, lng: 37.8333, region: 'SOUTHERN' };
  if (lower.includes('mikumi')) return { lat: -7.4000, lng: 37.4000, region: 'SOUTHERN' };
  if (lower.includes('katavi')) return { lat: -6.8333, lng: 31.1500, region: 'SOUTHERN' };
  
  if (lower.includes('zanzibar') || lower.includes('stone town') || lower.includes('nungwi') || lower.includes('paje') || lower.includes('mnemba') || lower.includes('jokerboat') || lower.includes('rib')) {
    return { lat: -6.1659, lng: 39.2026, region: 'ZANZIBAR' };
  }

  return { lat: -3.3667, lng: 36.6833, region: 'NORTHERN' };
};

const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function SafariStudio() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const addItemToStore = useItineraryStore((state) => state.addItem);
  const removeItemFromStore = useItineraryStore((state) => state.removeItem);

  const [days, setDays] = useState<Day[]>([
    { 
      id: crypto.randomUUID(), 
      day_number: 1, 
      location: 'Arrival & Welcome', 
      slots: [
        { id: crypto.randomUUID(), type: 'MORNING', item: null, name: null, location: { lat: null, lng: null } },
        { id: crypto.randomUUID(), type: 'AFTERNOON', item: null, name: null, location: { lat: null, lng: null } },
        { id: crypto.randomUUID(), type: 'EVENING', item: null, name: null, location: { lat: null, lng: null } }
      ] 
    }
  ]);
  
  const [residencyTier, setResidencyTier] = useState<ResidencyTier>('CITIZEN'); 
  const [hasOwnVehicle, setHasOwnVehicle] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(true);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'timeline' | 'map' | 'catalog' | 'cart'>('timeline');
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [aiActivityNotice, setAiActivityNotice] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [logisticalWarningModal, setLogisticalWarningModal] = useState<{ open: boolean; message: string; advice: string } | null>(null);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setDays([]); 
      } else {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        const { data: profile } = await (supabase
          .from('profiles' as any) as any)
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile && 'residency_tier' in profile && profile.residency_tier) {
          setResidencyTier(profile.residency_tier as ResidencyTier);
        }
      }
      setSessionChecked(true);
    };
    checkAuthAndProfile();
  }, []);

  const allItineraryItems = useMemo(() => {
    return days.flatMap(day => day.slots.map(s => ({ ...s, dayNumber: day.day_number })).filter(s => s.item !== null)) as (Day['slots'][0] & { item: ItineraryItem; dayNumber: number })[];
  }, [days]);

  // Chrono-Flow Deduplication, Per-Day Vehicle Logistics & Notification Engine
  const { subtotalCost, deduplicationNotices, requiresSafariCar, safariCarFee } = useMemo(() => {
    const uniqueDayItems = new Map<string, { item: ItineraryItem; dayNumber: number }>();
    const notices: string[] = [];
    let hasHotel = false;
    let hasPark = false;
    let hasExplicitSafariActivity = false;
    let explicitTransportSelected = false;

    days.forEach(day => {
      const daySlots = day.slots.filter(s => s.item !== null);
      const dayLodges = daySlots.filter(s => {
        const cat = (s.item?.category || '').toUpperCase();
        const name = (s.item?.name || '').toLowerCase();
        return cat === 'LODGES' || name.includes('lodge') || name.includes('camp') || name.includes('hotel');
      });

      const dayParks = daySlots.filter(s => {
        const cat = (s.item?.category || '').toUpperCase();
        return cat === 'SAFARIS' || cat === 'PARKS' || (s.item?.name || '').toLowerCase().includes('park');
      });
// Check for explicit game drives or safari activities
      const daySafaris = daySlots.filter(s => {
        const cat = (s.item?.category || '').toUpperCase();
        const name = (s.item?.name || '').toLowerCase();
        return cat === 'SAFARIS' || name.includes('game drive') || name.includes('safari');
      });

      const dayTransport = daySlots.filter(s => {
        const cat = (s.item?.category || '').toUpperCase();
        const name = (s.item?.name || '').toLowerCase();
        return cat === 'TRANSPORT' || name.includes('cruiser') || name.includes('4x4') || name.includes('vehicle') || name.includes('car');
      });

      if (dayLodges.length > 0) hasHotel = true;
      if (dayParks.length > 0) hasPark = true;
      if (daySafaris.length > 0) hasExplicitSafariActivity = true;
      if (dayTransport.length > 0) explicitTransportSelected = true;

      const lodgeCounts = new Map<string, number>();
      dayLodges.forEach(slot => {
        const idKey = slot.item?.id || slot.item?.name || '';
        lodgeCounts.set(idKey, (lodgeCounts.get(idKey) || 0) + 1);
      });

      lodgeCounts.forEach((count, idKey) => {
        if (count > 1) {
          const sampleLodge = dayLodges.find(s => (s.item?.id || s.item?.name) === idKey)?.item;
          const lodgeName = sampleLodge?.name || 'Selected Lodge';
          notices.push(`Chrono-Flow Notice (Day ${day.day_number}): ${lodgeName} is booked across multiple slots. You are only charged once for this day's stay.`);
        }
      });

      day.slots.forEach(slot => {
        if (slot.item) {
          const isLodge = dayLodges.includes(slot);
          if (isLodge) {
            const lodgeKey = `${day.day_number}-lodge-${slot.item.id || slot.item.name}`;
            if (!uniqueDayItems.has(lodgeKey)) {
              uniqueDayItems.set(lodgeKey, { item: slot.item, dayNumber: day.day_number });
            }
          } else {
            const uniqueKey = `${day.day_number}-${slot.id}-${slot.item.id}`;
            uniqueDayItems.set(uniqueKey, { item: slot.item, dayNumber: day.day_number });
          }
        }
      });
    });

    let total = 0;
    uniqueDayItems.forEach(({ item }) => {
      total += getBaseRateForTier(item, residencyTier);
    });

  // Triggers if you have a hotel paired with EITHER a park OR an explicit safari/game drive activity
    const needsVehicle = hasHotel && (hasPark || hasExplicitSafariActivity) && !explicitTransportSelected && !hasOwnVehicle;
    // Multiplied by total days ($400 per day rate)
    const vehicleFee = needsVehicle ? 400 * days.length : 0;

    if (needsVehicle) {
      notices.push(`Chrono-Flow Notice: Hotel and Wildlife Park detected. Automated 4x4 safari vehicle transport fee ($400/day across ${days.length} day(s)) has been included.`);
    } else if (hasOwnVehicle && hasHotel && hasPark) {
      notices.push(`Chrono-Flow Notice: Custom vehicle mode active. Safari vehicle fee waived.`);
    }

    return { 
      subtotalCost: total + vehicleFee, 
      deduplicationNotices: notices, 
      requiresSafariCar: needsVehicle,
      safariCarFee: vehicleFee 
    };
  }, [days, residencyTier, hasOwnVehicle]);

  const grandTotalCost = useMemo(() => {
    const vat = subtotalCost * 0.18;
    const agencyFee = subtotalCost * 0.20;
    return subtotalCost + vat + agencyFee;
  }, [subtotalCost]);

  const itineraryPaceScore = useMemo(() => {
    return analyzeItineraryPace(days, allItineraryItems);
  }, [days, allItineraryItems]);

  const mapLocations = useMemo(() => {
    return allItineraryItems.map(slot => ({
      id: slot.item.id,
      name: slot.item.name,
      latitude: slot.item.lat ?? 0,
      longitude: slot.item.lng ?? 0
    }));
  }, [allItineraryItems]);

  const handleCheckoutAttempt = () => {
    if (itineraryPaceScore.score < 50) {
      setLogisticalWarningModal({
        open: true,
        message: itineraryPaceScore.label,
        advice: itineraryPaceScore.advice
      });
      return;
    }
    router.push('/checkout');
  };

  const handleMoveItem = (dayId: string, slotId: string, item: ItineraryItem) => {
    if (!isAuthenticated) return;
    setDays(prevDays => prevDays.map(d => {
      if (d.id !== dayId) return d;
      return { 
        ...d, 
        slots: d.slots.map(s => s.id === slotId ? { 
          ...s, 
          item, 
          name: item.name, 
          location: { lat: item.lat, lng: item.lng } 
        } : s) 
      };
    }));
  };

  const handleAddItemDirectly = (item: ItineraryItem, specifiedDayNumber?: number, specifiedSlotType?: 'MORNING' | 'AFTERNOON' | 'EVENING') => {
    if (!isAuthenticated) return;
    const baseRate = getBaseRateForTier(item, residencyTier);

    let targetDayId: string | null = null;
    let targetSlotId: string | null = null;
    let targetSlotType: 'MORNING' | 'AFTERNOON' | 'EVENING' = specifiedSlotType || 'MORNING';
    let targetDayNumber = specifiedDayNumber || 1;

    const targetDay = days.find(d => d.day_number === targetDayNumber) || days[0];
    if (targetDay) {
      targetDayId = targetDay.id;
      targetDayNumber = targetDay.day_number;
      
      const targetSlot = targetDay.slots.find(s => s.type === targetSlotType);
      if (targetSlot) {
        targetSlotId = targetSlot.id;
      } else {
        const emptySlot = targetDay.slots.find(s => s.item === null) || targetDay.slots[0];
        targetSlotId = emptySlot.id;
        targetSlotType = emptySlot.type as any;
      }
    }

    if (!targetDayId || !targetSlotId) return;

    handleMoveItem(targetDayId, targetSlotId, item);
    addItemToStore({
      ...item,
      id: item.id,
      originalId: item.id,
      price: baseRate,
      slotId: targetSlotId,
      timeSlot: targetSlotType,
    } as any, targetDayNumber, targetSlotType);

    setAiActivityNotice(`✨ Added ${item.name} to Day ${targetDayNumber} (${targetSlotType})!`);
    setTimeout(() => setAiActivityNotice(null), 3000);
  };

  const handleRemoveItem = (dayId: string, slotId: string) => {
    const targetDay = days.find(d => d.id === dayId);
    const targetSlot = targetDay?.slots.find(s => s.id === slotId);

    setDays(prevDays => prevDays.map(d => {
      if (d.id !== dayId) return d;
      return { 
        ...d, 
        slots: d.slots.map(s => s.id === slotId ? { ...s, item: null, name: null, location: { lat: null, lng: null } } : s) 
      };
    }));

    if (targetSlot?.item?.id) {
      removeItemFromStore(targetSlot.item.id);
    }
  };

  const handleDeleteDay = (dayId: string) => {
    if (days.length <= 1) return;
    const dayToDelete = days.find(d => d.id === dayId);
    if (dayToDelete) {
      dayToDelete.slots.forEach(slot => {
        if (slot.item?.id) {
          removeItemFromStore(slot.item.id);
        }
      });
    }
    setDays(prevDays => prevDays.filter(d => d.id !== dayId).map((d, index) => ({ ...d, day_number: index + 1 })));
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setPdfStatus('generating');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;

      const options = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: 'Escape-Tours-Safari-Odyssey-Manifest.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().from(element).set(options).save();
      setPdfStatus('success');
      setTimeout(() => setPdfStatus('idle'), 2500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPdfStatus('idle');
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const addDay = () => {
    if (!isAuthenticated) return;
    setDays([...days, { 
      id: crypto.randomUUID(),
      day_number: days.length + 1, 
      location: 'New Horizon', 
      slots: [
        { id: crypto.randomUUID(), type: 'MORNING', item: null, name: null, location: { lat: null, lng: null } },
        { id: crypto.randomUUID(), type: 'AFTERNOON', item: null, name: null, location: { lat: null, lng: null } },
        { id: crypto.randomUUID(), type: 'EVENING', item: null, name: null, location: { lat: null, lng: null } }
      ]
    }]);
  };

  if (!sessionChecked) {
    return <div className="w-full h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-amber-400" size={32} /></div>;
  }

  return (
    <div className="relative flex flex-col xl:flex-row w-full h-screen overflow-hidden bg-slate-950 font-sans selection:bg-amber-500 selection:text-slate-950 justify-between p-3 sm:p-5 gap-6">
      
      {aiActivityNotice && (
        <div className="absolute top-4 left-4 right-4 xl:left-1/2 xl:-translate-x-1/2 z-50 bg-slate-900 border border-amber-400 text-amber-300 text-xs font-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <Sparkles size={16} className="animate-spin text-amber-400 shrink-0" />
          <span className="truncate">{aiActivityNotice}</span>
        </div>
      )}

      {/* Map Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ItineraryMapOverlay locations={mapLocations} />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="xl:hidden absolute bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center justify-around pointer-events-auto">
        <button 
          type="button"
          onClick={() => setMobileActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'timeline' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Layers size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Timeline</span>
        </button>
        <button 
          type="button"
          onClick={() => setMobileActiveTab('map')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'map' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <MapPin size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
        </button>
        <button 
          type="button"
          onClick={() => setMobileActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'catalog' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Compass size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </button>
        <button 
          type="button"
          onClick={() => setIsCartModalOpen(true)}
          className={`flex flex-col items-center gap-1 relative ${isCartModalOpen ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <ShoppingCart size={20} />
          {allItineraryItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
              {allItineraryItems.length}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
        </button>
      </div>

      {/* Left Studio Sidebar */}
      <div className="relative z-20 flex h-full items-center pointer-events-auto">
        {!isStudioOpen && isAuthenticated && (
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="absolute left-0 z-30 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 p-3 rounded-r-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            title="Open Studio"
          >
            <ChevronRight size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest writing-mode-vertical">Open Studio</span>
          </button>
        )}

        <aside className={`relative h-full transition-all duration-500 ease-in-out w-full xl:w-[500px] ${isStudioOpen ? 'translate-x-0 opacity-100 flex' : '-translate-x-full opacity-0 absolute pointer-events-none'} ${mobileActiveTab === 'timeline' ? 'flex' : 'hidden xl:flex'} flex-col`}>
          <div ref={printRef} className="h-full bg-slate-950/90 border border-amber-500/30 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-4 sm:p-6 flex flex-col overflow-hidden transition-all duration-700 relative backdrop-blur-xl">
            
            {!isAuthenticated && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
                  <Lock size={28} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mb-2">Authentication Required</h2>
                <p className="text-xs text-slate-400 mb-6 max-w-[280px]">Please log in to your User Hub account to initialize and build your custom safari itinerary blueprint.</p>
                <button 
                  type="button"
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg cursor-pointer"
                >
                  Sign In to Access Builder
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  <img src="https://escapetourstz.com/logo.png" alt="Escape Tours Logo" className="w-8 h-8 object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                  <Compass size={20} className="text-amber-400 absolute" style={{zIndex:-1}} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] tracking-widest font-black uppercase px-2 py-0.5 rounded-md border bg-amber-400/10 text-amber-300 border-amber-400/20">Escape Tours Master Blueprint</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">Safari Odyssey</h1>
                </div>
              </div>

              <div className="flex items-center gap-1.5 no-print">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={pdfStatus === 'generating'}
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
                    pdfStatus === 'success' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                  title="Download Professional Itinerary PDF"
                >
                  {pdfStatus === 'generating' && <Loader2 size={14} className="animate-spin text-amber-400" />}
                  {pdfStatus === 'success' && <CheckCircle2 size={14} />}
                  {pdfStatus === 'idle' && <Download size={14} />}
                  <span className="hidden sm:inline">{pdfStatus === 'generating' ? 'Exporting...' : pdfStatus === 'success' ? 'Downloaded!' : 'PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer relative"
                  title="Share Itinerary Link"
                >
                  <Share2 size={14} />
                  {shareCopied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
                      Copied Link!
                    </span>
                  )}
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Close Studio"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* AI Chrono-Flow Analyzer Banner */}
            <div className="mb-3 bg-slate-900/80 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${itineraryPaceScore.color} shrink-0`}>
                  <Activity size={18} className="animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">AI Chrono-Flow</span>
                    <span className={`text-[10px] font-black ${itineraryPaceScore.color}`}>Score: {itineraryPaceScore.score}%</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{itineraryPaceScore.label}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiOpen(true)}
                className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>AI Assistant</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {days.map((day) => (
                <DayCard
                  key={day.id}
                  day={day}
                  residencyTier={residencyTier}
                  onMoveItem={handleMoveItem}
                  onRemoveItem={handleRemoveItem}
                  onDeleteDay={handleDeleteDay}
                />
              ))}

              <button
                type="button"
                onClick={addDay}
                className="w-full py-3.5 border border-dashed border-white/20 hover:border-amber-400/65 rounded-2xl text-slate-400 hover:text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Expedition Day</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsCartModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-lg cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Cart Manifest</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-amber-400">${grandTotalCost.toFixed(0)}</span>
                  <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                    {allItineraryItems.length}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">View Details &rarr;</span>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Right Explorer / Catalog Sidebar (Maximized Full Height with Safari Car Included in Subtotal) */}
      <div className="relative z-25 flex h-full items-center pointer-events-auto">
        {!isPortfolioOpen && isAuthenticated && (
          <div className="absolute right-0 z-30">
            <button
              type="button"
              onClick={() => setIsPortfolioOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 rounded-l-2xl shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              title="Open Portfolio"
            >
              <Compass size={18} className="animate-spin text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest writing-mode-vertical">Open Portfolio</span>
              <ChevronLeft size={16} className="animate-pulse" />
            </button>
          </div>
        )}

        <aside className={`relative h-full transition-all duration-500 ease-in-out w-full xl:w-[650px] ${isPortfolioOpen ? 'translate-x-0 opacity-100 flex' : 'translate-x-full opacity-0 absolute pointer-events-none'} ${mobileActiveTab === 'catalog' ? 'flex' : 'hidden xl:flex'} flex-col`}>
          <div className="h-full bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Fully Expanded Inventory Screen Component Wrapper */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <ItineraryCategoryExplorer
                onAddItem={handleAddItemDirectly}
                residencyTier={residencyTier}
                onTierChange={setResidencyTier}
                isOpen={isPortfolioOpen}
                onClose={() => setIsPortfolioOpen(false)}
              />
            </div>

            {/* Desktop-only Compact Footer Totals & Vehicle Toggle */}
            <div className="hidden xl:flex mt-2 pt-2 border-t border-white/15 flex-col gap-1.5 shrink-0 bg-slate-950">
              
              {/* Own Vehicle Toggle Checkbox */}
              <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-amber-400" />
                  <span>I have my own vehicle</span>
                </div>
                <input 
                  type="checkbox"
                  checked={hasOwnVehicle}
                  onChange={(e) => setHasOwnVehicle(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Compact Subtotal Breakdown Bar (Includes per-day safari car fees when applicable) */}
              <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Subtotal</span>
                    <span className="font-bold text-white">${subtotalCost.toFixed(0)}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">VAT (18%)</span>
                    <span className="text-slate-300">+${(subtotalCost * 0.18).toFixed(0)}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Agency (20%)</span>
                    <span className="text-slate-300">+${(subtotalCost * 0.20).toFixed(0)}</span>
                  </div>
                </div>
                {requiresSafariCar && (
                  <div className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Includes 4x4 Safari Car (${safariCarFee})
                  </div>
                )}
              </div>

              {/* Grand Total Row */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Grand Total (Inc. VAT & Fees)</span>
                <span className="text-sm font-black text-amber-400">${grandTotalCost.toFixed(0)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutAttempt}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <CreditCard size={15} />
                <span>Proceed to Secure Checkout</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Cart Manifest Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-xl rounded-[2.5rem] p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
                  <Receipt size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-white tracking-tight">Expedition Cart Manifest</h2>
                  <p className="text-[11px] text-slate-400">Review selected itinerary items and cost breakdown</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar pr-1">
              {allItineraryItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Your cart manifest is currently empty.</p>
                  <p className="text-xs text-slate-500 mt-1">Add items from the explorer catalog to begin building your safari.</p>
                </div>
              ) : (
                allItineraryItems.map((slot, index) => {
                  const rate = getBaseRateForTier(slot.item, residencyTier);
                  return (
                    <div key={`${slot.item.id}-${index}`} className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          Day {slot.dayNumber} • {slot.type}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{slot.item.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{slot.item.location_name || 'Tanzania Safari Experience'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-400">${rate.toFixed(0)}</span>
                        <div className="text-[9px] text-slate-500 uppercase">{residencyTier} Rate</div>
                      </div>
                    </div>
                  );
                })
              )}

              {requiresSafariCar && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Chrono-Flow Logistics
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1">4x4 Safari Cruiser & Driver Guide (${400} / day)</h4>
                    <p className="text-[10px] text-slate-400 truncate">Automated transit coverage across {days.length} day(s)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400">${safariCarFee}</span>
                    <div className="text-[9px] text-slate-500 uppercase">Total Vehicle Fee</div>
                  </div>
                </div>
              )}
            </div>

            {allItineraryItems.length > 0 && (
              <div className="pt-4 border-t border-white/15 space-y-3">
                {deduplicationNotices.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 flex items-start gap-2 text-amber-300 text-[11px] shadow-lg">
                    <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {deduplicationNotices.map((notice, idx) => (
                        <p key={idx} className="font-medium">{notice}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">${subtotalCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Tanzania VAT (18%)</span>
                    <span>+${(subtotalCost * 0.18).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Agency Service & Coordination Fee (20%)</span>
                    <span>+${(subtotalCost * 0.20).toFixed(0)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">Grand Total</span>
                    <span className="text-lg font-black text-amber-400">${grandTotalCost.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartModalOpen(false);
                    handleCheckoutAttempt();
                  }}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-xl cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>Proceed to Secure Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logistical Warning Modal */}
      {logisticalWarningModal && logisticalWarningModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">{logisticalWarningModal.message}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{logisticalWarningModal.advice}</p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setLogisticalWarningModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Review Itinerary
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogisticalWarningModal(null);
                  router.push('/checkout');
                }}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        days={days}
        residencyTier={residencyTier}
        setDays={setDays}
      />
    </div>
  );
}