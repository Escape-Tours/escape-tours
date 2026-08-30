// components/ItineraryBuilderLayout.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItineraryBuilderLayoutProps {
  timelineComponent: React.ReactNode;
  mapComponent: React.ReactNode;
  catalogComponent: React.ReactNode;
}

export function ItineraryBuilderLayout({
  timelineComponent,
  mapComponent,
  catalogComponent,
}: ItineraryBuilderLayoutProps) {
  // Mobile active tab state: 'timeline' | 'map' | 'catalog'
  const [mobileTab, setMobileTab] = useState<'timeline' | 'map' | 'catalog'>('timeline');

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950">
      
      {/* =========================================================================
          1. DESKTOP VIEW: Side-by-side multi-column studio layout 
          ========================================================================= */}
      <div className="hidden md:flex flex-row w-full h-full overflow-hidden">
        {/* Timeline Builder Column */}
        <div className="w-1/3 h-full overflow-y-auto border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-xl">
          {timelineComponent}
        </div>
        
        {/* Mapbox Canvas Column */}
        <div className="w-1/3 h-full relative shadow-2xl">
          {mapComponent}
        </div>

        {/* Inventory Catalog Column */}
        <div className="w-1/3 h-full overflow-y-auto bg-slate-900/30 border-l border-slate-800/80">
          {catalogComponent}
        </div>
      </div>

      {/* =========================================================================
          2. MOBILE VIEW: Tabbed / Stacked world-class dynamic viewport 
          ========================================================================= */}
      <div className="flex md:hidden flex-col w-full h-full relative overflow-hidden pb-16">
        
        {/* Animated Viewport Switcher */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="w-full h-full overflow-y-auto absolute inset-0 pb-4"
            >
              {mobileTab === 'timeline' && timelineComponent}
              {mobileTab === 'map' && <div className="w-full h-full">{mapComponent}</div>}
              {mobileTab === 'catalog' && catalogComponent}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Quick Action Map Jump Pill */}
        {mobileTab !== 'map' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-20 right-4 z-30"
          >
            <button
              onClick={() => setMobileTab('map')}
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-4 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2.5 text-xs tracking-wide uppercase border border-amber-300/40 backdrop-blur-md active:scale-95 transition-transform"
            >
              <MapPin className="w-4 h-4 fill-slate-950 text-amber-400" />
              <span>Interactive Map</span>
            </button>
          </motion.div>
        )}

        {/* Mobile Sticky Bottom Command Center Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-around z-40 px-3 shadow-2xl">
          <button
            onClick={() => setMobileTab('timeline')}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-all ${
              mobileTab === 'timeline' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className={`w-5 h-5 mb-1 transition-transform ${mobileTab === 'timeline' ? 'scale-110' : ''}`} />
            <span>Timeline</span>
            {mobileTab === 'timeline' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </button>

          <button
            onClick={() => setMobileTab('map')}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-all ${
              mobileTab === 'map' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className={`w-5 h-5 mb-1 transition-transform ${mobileTab === 'map' ? 'scale-110' : ''}`} />
            <span>Map View</span>
            {mobileTab === 'map' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </button>

          <button
            onClick={() => setMobileTab('catalog')}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-all ${
              mobileTab === 'catalog' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className={`w-5 h-5 mb-1 transition-transform ${mobileTab === 'catalog' ? 'scale-110' : ''}`} />
            <span>Inventory</span>
            {mobileTab === 'catalog' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}