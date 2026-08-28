// components/ItineraryBuilderLayout.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Layers, Eye } from 'lucide-react';

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
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row bg-slate-950 text-white">
      
      {/* 1. DESKTOP VIEW: Side-by-side multi-column layout */}
      <div className="hidden md:flex flex-row w-full h-full overflow-hidden">
        {/* Timeline Builder Column */}
        <div className="w-1/3 h-full overflow-y-auto border-r border-slate-800">
          {timelineComponent}
        </div>
        
        {/* Mapbox Canvas Column */}
        <div className="w-1/3 h-full relative">
          {mapComponent}
        </div>

        {/* Inventory Catalog Column */}
        <div className="w-1/3 h-full overflow-y-auto bg-slate-900/50">
          {catalogComponent}
        </div>
      </div>

      {/* 2. MOBILE VIEW: Tabbed / Stacked dynamic viewport */}
      <div className="flex md:hidden flex-col w-full h-full pb-16 relative overflow-hidden">
        <div className="flex-1 w-full h-full overflow-y-auto relative">
          {mobileTab === 'timeline' && timelineComponent}
          {mobileTab === 'map' && <div className="w-full h-full">{mapComponent}</div>}
          {mobileTab === 'catalog' && catalogComponent}
        </div>

        {/* Mobile Floating Map Preview Pill (Quick Jump) */}
        {mobileTab !== 'map' && (
          <button
            onClick={() => setMobileTab('map')}
            className="absolute bottom-20 right-4 z-30 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-full shadow-lg font-semibold flex items-center gap-2 text-sm border border-amber-400/30 backdrop-blur-md"
          >
            <MapPin className="w-4 h-4" />
            <span>View Route Map</span>
          </button>
        )}

        {/* Mobile Sticky Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-40 px-2">
          <button
            onClick={() => setMobileTab('timeline')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors ${
              mobileTab === 'timeline' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('map')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors ${
              mobileTab === 'map' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setMobileTab('catalog')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors ${
              mobileTab === 'catalog' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 mb-1" />
            <span>Inventory</span>
          </button>
        </div>
      </div>

    </div>
  );
}