// components/lifestyle/AfterHoursHub.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { AFTER_HOURS_VENUES, AfterHoursVenue } from '@/lib/constants/index';

type RegionFilter = 'All' | 'Dar es Salaam' | 'Karatu' | 'Arusha' | 'Moshi';
type CategoryFilter = 'All' | 'Club' | 'Lounge' | 'Bush Party' | 'Beach Club';

export default function AfterHoursHub() {
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalVenue, setActiveModalVenue] = useState<AfterHoursVenue | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const regions: RegionFilter[] = ['All', 'Dar es Salaam', 'Karatu', 'Arusha', 'Moshi'];
  const categories: CategoryFilter[] = ['All', 'Club', 'Lounge', 'Bush Party', 'Beach Club'];

  // Filter logic based on region, category, and search query
  const filteredVenues = useMemo(() => {
    return AFTER_HOURS_VENUES.filter((venue) => {
      const matchesRegion = selectedRegion === 'All' || venue.region === selectedRegion;
      const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
      const matchesSearch = 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesRegion && matchesCategory && matchesSearch;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  const handleAddToItinerary = (venue: AfterHoursVenue) => {
    setActiveModalVenue(venue);
    setIsConfirmed(false);
  };

  const confirmSelection = () => {
    if (!activeModalVenue) return;
    // Dispatches to your global User Hub or state manager
    console.info(`[Escape Hub] Successfully bound ${activeModalVenue.name} to active user trip blueprint.`);
    setIsConfirmed(true);
    setTimeout(() => {
      setActiveModalVenue(null);
      setIsConfirmed(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Vision Statement */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Escape+ Lifestyle Hub
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">After Hours</h2>
          <p className="text-zinc-400 max-w-2xl text-base">
            Seamlessly bridge wild daytime circuits with Tanzania’s premier nightlife, elite coastal lounges, and curated underground bush parties.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="w-full lg:w-72">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search venue, vibe, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-2">Region:</span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-2">Vibe Type:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-zinc-100 text-black font-bold'
                  : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <p className="text-zinc-400 font-medium">No After Hours venues match your current filters.</p>
          <button 
            onClick={() => { setSelectedRegion('All'); setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-xl text-xs font-semibold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue: AfterHoursVenue) => (
            <div 
              key={venue.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Visual Header Banner */}
                <div className="h-52 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-zinc-800 relative flex items-end p-5 overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-950/20 group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-400 border border-amber-500/30 shadow-md">
                    {venue.category}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs text-amber-400/90 uppercase tracking-widest font-bold">
                        {venue.region}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{venue.name}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {venue.description}
                  </p>

                  <div className="space-y-2.5 pt-3 border-t border-zinc-800/80 text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-medium">Atmosphere:</span>
                      <span className="text-zinc-200 font-semibold">{venue.vibe}</span>
                    </div>
                    {venue.featuredDj && (
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-medium">Resident Sound:</span>
                        <span className="text-amber-400 font-semibold">{venue.featuredDj}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-medium">Exact Area:</span>
                      <span className="text-zinc-200 font-semibold">{venue.location}</span>
                    </div>
                  </div>

                  {/* Exclusive Perk Banner */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-300 flex items-start gap-3 shadow-inner">
                    <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <span className="font-bold text-amber-400 block mb-0.5">Escape Pass Privilege:</span>
                      <span className="leading-snug">{venue.perks}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                <button 
                  onClick={() => handleAddToItinerary(venue)}
                  className="w-full bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Add to Itinerary Vibe</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {activeModalVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">{activeModalVenue.name}</h3>
              <p className="text-sm text-zinc-400">
                Confirming integration with your active Escape Tours blueprint.
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Region & Hub:</span>
                <span className="text-white font-medium">{activeModalVenue.region}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Locked Privilege:</span>
                <span className="text-amber-400 font-medium text-right max-w-[200px] truncate">{activeModalVenue.perks}</span>
              </div>
            </div>

            {isConfirmed ? (
              <div className="bg-amber-500 text-black font-bold py-3.5 rounded-xl text-center text-sm shadow-lg animate-pulse">
                Successfully Added to Blueprint!
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModalVenue(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSelection}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  Confirm Vibe
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}