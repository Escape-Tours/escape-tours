'use client';
import { ItineraryBuilderLayout } from '@/components/ItineraryBuilderLayout';
import { TimelineView } from '@/components/builder/TimelineView';
import { InventoryLibrary } from '@/components/builder/InventoryLibrary';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { SlideTrigger } from '@/components/ui/SlideTrigger';
import { ItineraryBuilder } from './ItineraryCategoryExplorer';
import DayCard from '@/components/itinerary/DayCard';
import AIAssistantDrawer from '@/components/itinerary/AIAssistantDrawer';
import { Save, Sparkles, Compass, Plus, Layers, MapPin, CheckCircle2, Loader2, Bot, ShoppingCart, Lock, DollarSign, Users, Trash2, Share2, ShieldCheck, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { saveItinerary } from '@/lib/services/itineraryService';
import { validatePayload } from '@/lib/services/stagingValidator';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/constants/index';
import { supabase } from '@/lib/supabase/client';

const ItineraryMapOverlay = dynamic(() => import('@/components/itinerary/ItineraryMapOverlay'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-950 animate-pulse rounded-3xl" />
});

export const SafariStudio = () => {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  const [isStudioOpen, setIsStudioOpen] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'timeline' | 'map' | 'catalog'>('timeline');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [aiActivityNotice, setAiActivityNotice] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setDays([]); 
      } else {
        setIsAuthenticated(true);
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

  const estimatedTotal = useMemo(() => {
    const totalAdults = Math.max(1, guests.adults);
    const totalChildren = Math.max(0, guests.children);
    
    return allItineraryItems.reduce((sum, slot) => {
      const item = slot.item;
      let baseRate = item.price ?? item.base_price ?? 150; 
      
      if (residencyTier === 'RESIDENT' && item.resident_price) {
        baseRate = item.resident_price;
      } else if (residencyTier === 'CITIZEN' && item.ea_price) {
        baseRate = item.ea_price;
      }

      const adultCost = baseRate * totalAdults;
      const childCost = (baseRate * 0.5) * totalChildren; 
      return sum + adultCost + childCost;
    }, 0);
  }, [allItineraryItems, residencyTier, guests]);

  const containerTheme = useMemo(() => {
    const rawItems = allItineraryItems.map(s => s.item);
    const isMarine = rawItems.some(item => item.metadata?.type === 'MARINE' || item.name?.toLowerCase().includes('zanzibar') || item.name?.toLowerCase().includes('seafront'));
    return {
      base: isMarine 
        ? "bg-slate-900 border-cyan-500/30 shadow-xl" 
        : "bg-slate-950 border-amber-500/30 shadow-xl",
      accent: isMarine ? "text-cyan-400" : "text-amber-400",
      glow: isMarine ? "bg-cyan-500/15 border-cyan-500/40" : "bg-amber-500/15 border-amber-500/40",
      badge: isMarine ? "bg-cyan-400/10 text-cyan-300 border-cyan-400/30" : "bg-amber-400/10 text-amber-300 border-amber-400/20"
    };
  }, [allItineraryItems]);

  const mapLocations = useMemo(() => {
    return allItineraryItems.map(slot => ({
      id: slot.item.id,
      name: slot.item.name,
      latitude: slot.item.lat ?? 0,
      longitude: slot.item.lng ?? 0
    }));
  }, [allItineraryItems]);

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

  const handleRemoveItem = (dayId: string, slotId: string) => {
    setDays(prevDays => prevDays.map(d => {
      if (d.id !== dayId) return d;
      return { 
        ...d, 
        slots: d.slots.map(s => s.id === slotId ? { ...s, item: null, name: null, location: { lat: null, lng: null } } : s) 
      };
    }));
  };

  const handleDeleteDay = (dayId: string) => {
    if (days.length <= 1) return;
    setDays(prevDays => prevDays.filter(d => d.id !== dayId).map((d, index) => ({ ...d, day_number: index + 1 })));
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;
    setSaveStatus('saving');
    try {
      if (!validatePayload(days, residencyTier)) throw new Error("Data integrity check failed");
      await saveItinerary('6590822a-f110-4c42-8c23-80afd256059d', "Safari Odyssey Masterpiece", days);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      console.error("Save interrupted:", err);
      setSaveStatus('idle');
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setPdfStatus('generating');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;

      const options = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: 'Safari-Odyssey-Masterpiece.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          windowWidth: element.scrollWidth,
          onclone: (clonedDoc: Document) => {
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              * {
                color-scheme: dark;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              body, .bg-slate-950, .bg-slate-900 {
                background-color: #020617 !important;
                color: #ffffff !important;
              }
              .text-slate-400 {
                color: #94a3b8 !important;
              }
              .text-slate-300 {
                color: #cbd5e1 !important;
              }
              button, .no-print {
                display: none !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
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

  const handleApplyItinerary = (newDays: Day[]) => {
    if (!isAuthenticated) return;
    setDays(newDays);
    setAiActivityNotice("✨ AI Architect successfully synthesized & deployed new master blueprint!");
    setTimeout(() => setAiActivityNotice(null), 4000);
  };

  if (!sessionChecked) {
    return <div className="w-full h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-amber-400" size={32} /></div>;
  }

  return (
    <div className="relative flex flex-col lg:flex-row w-full h-screen overflow-hidden bg-slate-950 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {aiActivityNotice && (
        <div className="absolute top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 z-50 bg-slate-900 border border-amber-400 text-amber-300 text-xs font-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <Sparkles size={16} className="animate-spin text-amber-400 shrink-0" />
          <span className="truncate">{aiActivityNotice}</span>
        </div>
      )}

      {/* Map Background Layer */}
      <div className={`absolute inset-0 z-0 ${mobileActiveTab === 'map' ? 'block' : 'hidden lg:block'}`}>
        <ItineraryMapOverlay locations={mapLocations} />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center justify-around">
        <button 
          onClick={() => setMobileActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'timeline' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Layers size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Timeline</span>
        </button>
        <button 
          onClick={() => setMobileActiveTab('map')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'map' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <MapPin size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
        </button>
        <button 
          onClick={() => setMobileActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 ${mobileActiveTab === 'catalog' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Compass size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </button>
        <button 
          onClick={() => setIsCartModalOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400 relative"
        >
          <ShoppingCart size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
          {allItineraryItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
              {allItineraryItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Left Collapsible Studio Drawer + Slide Trigger */}
      <div className="relative z-20 flex h-full items-center">
        {/* Slide Trigger for Studio when closed */}
        {!isStudioOpen && isAuthenticated && (
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="absolute left-0 z-30 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 p-3 rounded-r-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            title="Pull to Slide Studio"
          >
            <ChevronRight size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest writing-mode-vertical">Open Studio</span>
          </button>
        )}

        {/* Main Studio Sidebar / Timeline Container */}
        <aside className={`relative h-full p-3 sm:p-5 transition-all duration-500 ease-in-out w-full lg:w-[740px] ${isStudioOpen ? 'translate-x-0 opacity-100 flex' : '-translate-x-full opacity-0 absolute pointer-events-none'} ${mobileActiveTab === 'timeline' ? 'flex' : 'hidden lg:flex'} flex-col pb-20 lg:pb-5`}>
          <div ref={printRef} className={`h-full ${containerTheme.base} rounded-[2rem] sm:rounded-[2.5rem] border shadow-2xl p-4 sm:p-7 flex flex-col overflow-hidden transition-all duration-700 relative bg-slate-950`}>
            
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

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ${containerTheme.glow} border flex items-center justify-center ${containerTheme.accent}`}>
                  <Compass size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] sm:text-[10px] tracking-widest font-black uppercase px-2 py-0.5 rounded-md border ${containerTheme.badge}`}>Studio Master Blueprint</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">Safari Odyssey</h1>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 no-print">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={pdfStatus === 'generating'}
                  className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
                    pdfStatus === 'success'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
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
                  className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer relative"
                  title="Share Itinerary Link"
                >
                  <Share2 size={14} />
                  {shareCopied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
                      Copied Link!
                    </span>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsAiOpen(true)}
                  className="group relative flex items-center gap-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-amber-400/50 text-amber-300 font-black text-xs tracking-wider uppercase hover:border-amber-400 transition-all shadow-lg hover:scale-105 cursor-pointer"
                  title="Awaken AI Architect"
                >
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <Bot size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline text-amber-300">AI</span>
                </button>

                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
                    saveStatus === 'success' 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg'
                  }`}
                >
                  {saveStatus === 'saving' && <Loader2 size={14} className="animate-spin" />}
                  {saveStatus === 'success' && <CheckCircle2 size={14} />}
                  {saveStatus === 'idle' && <Save size={14} />}
                  <span className="hidden sm:inline">{saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'success' ? 'Secured!' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer ml-1"
                  title="Hide Studio Drawer"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <Layers size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Duration</p>
                  <p className="text-sm font-black text-white">{days.length} {days.length === 1 ? 'Day' : 'Days'}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Mapped Stops</p>
                  <p className="text-sm font-black text-white">{allItineraryItems.length} Locations</p>
                </div>
              </div>
            </div>

            {/* Day Cards List Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar bg-slate-950 mb-4">
              {days.map((day) => (
                <DayCard 
                  key={day.id} 
                  day={day} 
                  residencyTier={residencyTier}
                  guests={guests} 
                  setGuests={setGuests} 
                  onMoveItem={handleMoveItem} 
                  onRemoveItem={handleRemoveItem} 
                  onDeleteDay={handleDeleteDay} 
                />
              ))}

              <button 
                type="button"
                onClick={addDay} 
                className="w-full py-4 border-2 border-dashed border-white/15 rounded-2xl text-slate-300 font-bold text-xs tracking-wider uppercase hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-400 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-inner no-print"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Add New Day</span>
              </button>
            </div>

          </div>
        </aside>
      </div>

      {/* Center Spacer over map */}
      <div className="hidden lg:flex flex-1 pointer-events-none" />

      {/* Right Collapsible Experience Catalog Drawer */}
      <div className="relative z-20 flex h-full items-center">
        {/* Slide Trigger for Catalog when closed */}
        {!isCatalogOpen && isAuthenticated && (
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="absolute right-0 z-30 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 p-3 rounded-l-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            title="Pull to Slide Catalog"
          >
            <span className="text-[10px] font-black uppercase tracking-widest writing-mode-vertical">Catalog</span>
            <ChevronLeft size={18} className="animate-pulse" />
          </button>
        )}

        {isAuthenticated && (
          <aside className={`w-full lg:w-[420px] h-full bg-slate-950/95 backdrop-blur-2xl shadow-2xl z-30 border-l border-white/10 flex flex-col transition-all duration-500 ease-in-out ${isCatalogOpen ? 'translate-x-0 opacity-100 flex' : 'translate-x-full opacity-0 absolute pointer-events-none'} ${mobileActiveTab === 'catalog' ? 'flex' : 'hidden lg:flex'} pb-20 lg:pb-0`}>
            <div className="flex p-4 sm:p-5 border-b border-white/10 justify-between items-center bg-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-xs font-black tracking-widest text-white uppercase">Experience Catalog ({residencyTier})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Hide</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ItineraryBuilder residencyTier={residencyTier} />
            </div>
          </aside>
        )}
      </div>

      {/* Cart Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-amber-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Itinerary Cart Manifest</h3>
                  <p className="text-xs text-slate-400">Review selected experiences, adjust guest counts, and view live residency pricing quotes.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsCartModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Residency Tariff Tier</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    {residencyTier} (Profile Locked)
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-amber-400" />
                    <span className="text-xs font-bold text-slate-300">Guests Count</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Adults</span>
                      <button 
                        type="button"
                        onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                      >-</button>
                      <span className="text-xs font-black text-white w-4 text-center">{guests.adults}</span>
                      <button 
                        type="button"
                        onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                      >+</button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Kids</span>
                      <button 
                        type="button"
                        onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                      >-</button>
                      <span className="text-xs font-black text-white w-4 text-center">{guests.children}</span>
                      <button 
                        type="button"
                        onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              {allItineraryItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Your cart is currently empty.</p>
                  <p className="text-xs text-slate-500 mt-1">Add experiences from the catalog or awaken the AI Architect to populate your trip.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allItineraryItems.map((slot, idx) => {
                    const item = slot.item;
                    let activeRate = item.price ?? item.base_price ?? 150;
                    if (residencyTier === 'RESIDENT' && item.resident_price) {
                      activeRate = item.resident_price;
                    } else if (residencyTier === 'CITIZEN' && item.ea_price) {
                      activeRate = item.ea_price;
                    }

                    return (
                      <div key={idx} className="bg-slate-950 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">Day {slot.dayNumber} - {slot.type}</span>
                          </div>
                          <h4 className="text-sm font-black text-white truncate">{item.name}</h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{item.location_name || 'Tanzania Safari Circuit'}</p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-black text-amber-400">${activeRate}</span>
                            <span className="text-[10px] text-slate-500 block">per person ({residencyTier.toLowerCase()})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const parentDay = days.find(d => d.day_number === slot.dayNumber);
                              if (parentDay) handleRemoveItem(parentDay.id, slot.id);
                            }}
                            className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Estimated Total Quote</span>
                <span className="text-2xl font-black text-white flex items-center gap-0.5">
                  <DollarSign size={20} className="text-amber-400" />
                  {estimatedTotal.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartModalOpen(false);
                  handleSave();
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                Secure & Save Itinerary
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
        onApplyItinerary={handleApplyItinerary}
      />
    </div>
  );
};

export default SafariStudio;