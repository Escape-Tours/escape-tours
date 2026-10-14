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
import { analyzeItineraryPace } from '@/lib/services/itineraryAnalyzer';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/constants/index';
import { supabase } from '@/lib/supabase/client';

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

export default function SafariStudio() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const addItemToStore = useItineraryStore((state) => state.addItem);
  const removeItemFromStore = useItineraryStore((state) => state.removeItem);
  const storeTier = useItineraryStore((state) => state.tier);
  const setStoreTier = useItineraryStore((state) => state.setTier);

  const storeItems = useItineraryStore((state) => state.items);
  const afterHoursItems = useItineraryStore((state) => (state as any).afterHoursItems || []);

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
          setStoreTier(profile.residency_tier as ResidencyTier);
        }
      }
      setSessionChecked(true);
    };
    checkAuthAndProfile();
  }, [setStoreTier]);

  const handleTierChange = (newTier: ResidencyTier) => {
    setResidencyTier(newTier);
    setStoreTier(newTier);
  };

  const allItineraryItems = useMemo(() => {
    return days.flatMap(day => day.slots.map(s => ({ ...s, dayNumber: day.day_number })).filter(s => s.item !== null)) as (Day['slots'][0] & { item: ItineraryItem; dayNumber: number })[];
  }, [days]);

  const costBreakdown = useMemo(() => {
    let subtotal = 0;
    
    // Track unique lodges per day for same-day deduplication
    const billedLodgesPerDay = new Map<number, Set<string>>();

    days.forEach(day => {
      const dayLodges = new Set<string>();
      day.slots.forEach(slot => {
        if (!slot.item) return;
        const item = slot.item;
        const cat = String(item.category || '').toUpperCase();
        const name = String(item.name || '').toLowerCase();
        
        const isLodge = cat === 'LODGES' || name.includes('lodge') || name.includes('camp') || name.includes('hotel') || name.includes('resort') || name.includes('hellen');
        const rate = getBaseRateForTier(item, residencyTier);

        if (isLodge) {
          const lodgeKey = String(item.id || name).trim().toLowerCase();
          if (!dayLodges.has(lodgeKey)) {
            dayLodges.add(lodgeKey);
            subtotal += rate;
          }
        } else {
          subtotal += rate;
        }
      });
      billedLodgesPerDay.set(day.day_number, dayLodges);
    });

    afterHoursItems.forEach((ah: any) => {
      const rate = parseFloat(ah.price || ah.base_price || 0);
      if (!isNaN(rate)) subtotal += rate;
    });

    // Check if any slot contains a Park, Safari, or Game Drive activity
    const hasSafariOrParkActivity = allItineraryItems.some(slot => {
      const cat = String(slot.item?.category || '').toUpperCase();
      const name = String(slot.item?.name || '').toLowerCase();
      const location = String(slot.item?.location || (slot.item as any)?.location_name || '').toLowerCase();
      return (
        cat === 'PARKS' || 
        cat === 'SAFARIS' || 
        cat === 'ACTIVITIES' ||
        name.includes('park') || 
        name.includes('safari') || 
        name.includes('game drive') ||
        name.includes('serengeti') || 
        name.includes('ngorongoro') || 
        name.includes('tarangire')
      );
    });

    const hasAnyItems = allItineraryItems.length > 0 || afterHoursItems.length > 0;
    const transport = (hasOwnVehicle || !hasSafariOrParkActivity) ? 0 : days.length * 350;
    const vat = subtotal * 0.18;
    const agencyFee = hasAnyItems ? (subtotal + transport) * 0.20 : 0;
    const grandTotal = subtotal + transport + vat + agencyFee;

    const notifications: string[] = [];
    if (!hasAnyItems) {
      notifications.push("Add items to your itinerary to calculate complete logistics and pricing.");
    }

    return {
      subtotal,
      transport,
      vat,
      agencyFee,
      grandTotal,
      notifications
    };
  }, [days, allItineraryItems, afterHoursItems, residencyTier, hasOwnVehicle]);

  const subtotalCost = costBreakdown.subtotal;
  const grandTotalCost = costBreakdown.grandTotal;
  const deduplicationNotices = costBreakdown.notifications;
  const safariCarFee = costBreakdown.transport;
  const requiresSafariCar = safariCarFee > 0;

  // Integrated Enterprise Chrono-Flow Analyzer Call
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
    if (allItineraryItems.length === 0 && afterHoursItems.length === 0) {
      return;
    }
    if (itineraryPaceScore.score < 40) {
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

  const handleAddItemDirectly = (
    item: ItineraryItem, 
    specifiedDayNumber?: number | string | any, 
    specifiedSlotType?: any
  ) => {
    if (!isAuthenticated) return;

    const baseRate = getBaseRateForTier(item, residencyTier);

    let parsedDayNum = 1;
    const extractDayFromVal = (val: any): number | null => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const match = val.match(/\d+/);
        if (match) return parseInt(match[0], 10);
      }
      if (val && typeof val === 'object') {
        const candidate = val.targetDay ?? val.dayNumber ?? val.day ?? val.day_number ?? val.selectedDay;
        if (candidate !== undefined && candidate !== null) {
          if (typeof candidate === 'number') return candidate;
          const match = String(candidate).match(/\d+/);
          if (match) return parseInt(match[0], 10);
        }
      }
      return null;
    };

    const foundDay = extractDayFromVal(specifiedDayNumber) ?? extractDayFromVal(specifiedSlotType) ?? extractDayFromVal(item);
    if (foundDay !== null && foundDay > 0) {
      parsedDayNum = foundDay;
    }

    const extractSlotFromVal = (val: any): string => {
      if (typeof val === 'string') {
        const upper = val.trim().toUpperCase();
        if (upper.includes('AFTERNOON') || upper.includes('EVENING') || upper.includes('NIGHT') || upper.includes('MORNING') || upper.includes('AM') || upper.includes('PM')) {
          return val;
        }
      }
      if (val && typeof val === 'object') {
        return val.timeSlot || val.slot || val.type || val.value || val.selectedSlot || '';
      }
      return '';
    };

    const rawSlotString = extractSlotFromVal(specifiedSlotType) || extractSlotFromVal(specifiedDayNumber) || extractSlotFromVal(item) || (item as any)?.timeSlot || '';

    const upperSlot = String(rawSlotString).trim().toUpperCase();
    let normalizedSlotType: 'MORNING' | 'AFTERNOON' | 'EVENING' = 'MORNING';
    if (upperSlot.includes('AFTERNOON')) {
      normalizedSlotType = 'AFTERNOON';
    } else if (upperSlot.includes('EVENING') || upperSlot.includes('NIGHT')) {
      normalizedSlotType = 'EVENING';
    } else if (upperSlot.includes('MORNING') || upperSlot.includes('AM')) {
      normalizedSlotType = 'MORNING';
    }

    setDays(prevDays => {
      let currentDays = [...prevDays];

      while (currentDays.length < parsedDayNum) {
        const newDayNum = currentDays.length + 1;
        currentDays.push({
          id: crypto.randomUUID(),
          day_number: newDayNum,
          location: `Expedition Day ${newDayNum}`,
          slots: [
            { id: crypto.randomUUID(), type: 'MORNING', item: null, name: null, location: { lat: null, lng: null } },
            { id: crypto.randomUUID(), type: 'AFTERNOON', item: null, name: null, location: { lat: null, lng: null } },
            { id: crypto.randomUUID(), type: 'EVENING', item: null, name: null, location: { lat: null, lng: null } }
          ]
        });
      }

      return currentDays.map(d => {
        if (d.day_number !== parsedDayNum) return d;

        return {
          ...d,
          slots: d.slots.map(s => {
            if (s.type !== normalizedSlotType) return s;

            if (s.item?.id) {
              removeItemFromStore(s.item.id);
            }

            addItemToStore({
              ...item,
              id: item.id,
              originalId: item.id,
              price: baseRate,
              slotId: s.id,
              timeSlot: normalizedSlotType,
            } as any, parsedDayNum, normalizedSlotType);

            return {
              ...s,
              item,
              name: item.name,
              location: { lat: item.lat ?? null, lng: item.lng ?? null }
            };
          })
        };
      });
    });

    setAiActivityNotice(`✨ Placed ${item.name} in Day ${parsedDayNum} (${normalizedSlotType})!`);
    setTimeout(() => setAiActivityNotice(null), 3000);
  };

  const handleRemoveItem = (dayIdOrNumber?: string | number | any, slotIdOrType?: string | any) => {
    setDays(prevDays => prevDays.map(d => {
      let isTargetDay = false;
      if (typeof dayIdOrNumber === 'string' || typeof dayIdOrNumber === 'number') {
        isTargetDay = d.id === dayIdOrNumber || d.day_number === Number(dayIdOrNumber);
      } else if (dayIdOrNumber && typeof dayIdOrNumber === 'object') {
        const targetNum = dayIdOrNumber.targetDay ?? dayIdOrNumber.dayNumber ?? dayIdOrNumber.day ?? dayIdOrNumber.day_number;
        isTargetDay = targetNum !== undefined ? d.day_number === Number(targetNum) : true;
      } else {
        return d;
      }

      if (!isTargetDay) return d;

      return {
        ...d,
        slots: d.slots.map(s => {
          let matchesSlot = false;
          if (typeof slotIdOrType === 'string') {
            const upper = slotIdOrType.trim().toUpperCase();
            if (upper === 'MORNING' || upper === 'AFTERNOON' || upper === 'EVENING' || upper === 'NIGHT') {
              matchesSlot = s.type === upper;
            } else {
              matchesSlot = s.id === slotIdOrType || s.item?.id === slotIdOrType;
            }
          } else if (slotIdOrType && typeof slotIdOrType === 'object') {
            matchesSlot = s.id === slotIdOrType.id || s.id === slotIdOrType.slotId || s.type === slotIdOrType.type;
          }

          if (matchesSlot) {
            if (s.item?.id) {
              removeItemFromStore(s.item.id);
            }
            return {
              ...s,
              item: null,
              name: null,
              location: { lat: null, lng: null }
            };
          }
          return s;
        })
      };
    }));
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
      <div className="xl:hidden absolute bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center justify-around pointer-events-auto touch-manipulation">
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
            className="absolute left-0 z-30 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 p-3 rounded-r-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer touch-manipulation"
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
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg cursor-pointer touch-manipulation"
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
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer touch-manipulation ${
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
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer relative touch-manipulation"
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
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all cursor-pointer touch-manipulation"
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
                className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition shrink-0 cursor-pointer touch-manipulation"
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
                className="w-full py-3.5 border border-dashed border-white/20 hover:border-amber-400/65 rounded-2xl text-slate-400 hover:text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all bg-white/5 hover:bg-white/10 cursor-pointer touch-manipulation"
              >
                <Plus size={16} />
                <span>Add Expedition Day</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsCartModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-lg cursor-pointer group touch-manipulation"
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

      {/* Right Explorer / Catalog Sidebar */}
      <div className="relative z-25 flex h-full items-center pointer-events-auto">
        {!isPortfolioOpen && isAuthenticated && (
          <div className="absolute right-0 z-30">
            <button
              type="button"
              onClick={() => setIsPortfolioOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 rounded-l-2xl shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer touch-manipulation"
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
            
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <ItineraryCategoryExplorer
                onAddItem={handleAddItemDirectly}
                onRemoveItem={handleRemoveItem}
                residencyTier={residencyTier}
                onTierChange={handleTierChange}
                isOpen={isPortfolioOpen}
                onClose={() => setIsPortfolioOpen(false)}
              />
            </div>

            {/* Desktop-only Compact Footer Totals & Vehicle Toggle */}
            <div className="hidden xl:flex mt-2 pt-2 border-t border-white/15 flex-col gap-1.5 shrink-0 bg-slate-950">
              
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

              <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Subtotal</span>
                    <span className="font-bold text-white">${subtotalCost.toFixed(0)}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">VAT (18%)</span>
                    <span className="text-slate-300">+${costBreakdown.vat.toFixed(0)}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Agency (20%)</span>
                    <span className="text-slate-300">+${costBreakdown.agencyFee.toFixed(0)}</span>
                  </div>
                </div>
                {requiresSafariCar && (
                  <div className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Includes 4x4 Safari Car (${safariCarFee})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Grand Total (Inc. VAT & Fees)</span>
                <span className="text-sm font-black text-amber-400">${grandTotalCost.toFixed(0)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutAttempt}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer touch-manipulation"
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
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all cursor-pointer touch-manipulation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar pr-1">
              {allItineraryItems.length === 0 && afterHoursItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Your cart manifest is currently empty.</p>
                  <p className="text-xs text-slate-500 mt-1">Add items from the explorer catalog to begin building your safari.</p>
                </div>
              ) : (
                <>
                  {allItineraryItems.map((slot, index) => {
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
                  })}

                  {afterHoursItems.map((ah: any, index: number) => {
                    const rate = parseFloat(ah.price || ah.base_price || 0);
                    return (
                      <div key={`ah-${ah.id || index}`} className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            After Hours / Bush Party
                          </span>
                          <h4 className="text-xs font-bold text-white truncate mt-1">{ah.name}</h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-amber-400">${rate.toFixed(0)}</span>
                          <div className="text-[9px] text-slate-500 uppercase">After Hours</div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {requiresSafariCar && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/30">
                      Chrono-Flow Logistics
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1">4x4 Safari Cruiser & Driver Guide</h4>
                    <p className="text-[10px] text-slate-400 truncate">Automated transit coverage across {days.length} day(s)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400">${safariCarFee}</span>
                    <div className="text-[9px] text-slate-500 uppercase">Total Vehicle Fee</div>
                  </div>
                </div>
              )}
            </div>

            {(allItineraryItems.length > 0 || afterHoursItems.length > 0) && (
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
                    <span>+${costBreakdown.vat.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Agency Service & Coordination Fee (20%)</span>
                    <span>+${costBreakdown.agencyFee.toFixed(0)}</span>
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
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-xl cursor-pointer touch-manipulation"
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
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer touch-manipulation"
              >
                Review Itinerary
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogisticalWarningModal(null);
                  router.push('/checkout');
                }}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer touch-manipulation"
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