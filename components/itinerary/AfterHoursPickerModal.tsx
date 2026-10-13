// components/itinerary/AfterHoursPickerModal.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, MapPin, Search, Check, ShieldCheck, Wine, Flame } from 'lucide-react';
import { AfterHoursVenue, AFTER_HOURS_VENUES } from '@/lib/constants/index';
import { ResidencyTier } from '@/lib/types/TariffParkFees';

interface AfterHoursPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (venue: AfterHoursVenue) => void;
  residencyTier?: ResidencyTier;
}

export default function AfterHoursPickerModal({
  isOpen,
  onClose,
  onSelect,
  residencyTier = 'INTERNATIONAL'
}: AfterHoursPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const enhancedVenues = useMemo(() => {
    const list: AfterHoursVenue[] = [...AFTER_HOURS_VENUES];
    const hasBushParty = list.some((v) => {
      const cat = String(v.category || '').toUpperCase();
      const name = String(v.name || '').toUpperCase();
      return cat.includes('BUSH') || cat.includes('PARTY') || name.includes('BUSH') || name.includes('PARTY');
    });

    if (!hasBushParty) {
      list.push({
        id: 'bush-party-serengeti-1',
        name: 'Serengeti Starlight Bush Dinner & Bonfire',
        category: 'Bush Party',
        location: 'Serengeti National Park',
        description: 'An exclusive traditional bonfire gathering under the African stars with live acoustic tunes and private bush bar.',
        price: 95,
        perks: 'Open Bush Bar • Private Bonfire • Armed Ranger Security'
      } as unknown as AfterHoursVenue);
    }
    return list;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(enhancedVenues.map((v) => (v.category || 'Nightlife').toUpperCase()));
    return ['ALL', ...Array.from(cats)];
  }, [enhancedVenues]);

  const filteredVenues = useMemo(() => {
    return enhancedVenues.filter((venue) => {
      const matchesSearch = 
        (venue.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const venueCat = String(venue.category || 'Nightlife').toUpperCase();
      const isBushFilter = selectedCategory.toUpperCase().includes('BUSH') || selectedCategory.toUpperCase().includes('PARTY');
      const isVenueBush = venueCat.includes('BUSH') || venueCat.includes('PARTY') || String(venue.name || '').toUpperCase().includes('BUSH');

      const matchesCategory = 
        selectedCategory === 'ALL' || 
        (isBushFilter ? isVenueBush : venueCat === selectedCategory.toUpperCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [enhancedVenues, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-br from-[#0B132B]/95 via-[#070D1F]/98 to-[#040814] border border-white/15 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col max-h-[85vh] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-br from-amber-400/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white">
                After Hours & Bush Party Selector
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Elevate your evening experience with curated nightlife and exclusive bush parties.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 py-5 relative z-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search lounges, clubs, or bush parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 shadow-inner transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Venues Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 py-2">
          {filteredVenues.length === 0 ? (
            <div className="col-span-full py-16 text-center flex flex-col items-center justify-center gap-2">
              <Wine size={32} className="text-slate-600" />
              <p className="text-sm font-bold text-slate-400">No experiences found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            filteredVenues.map((venue) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rawPrice = (venue as any).price ?? (venue as any).basePrice ?? (venue as any).cost ?? 50;
              const basePrice = Number(rawPrice) > 0 ? Number(rawPrice) : 50;

              const perksString = typeof venue.perks === 'string' ? venue.perks : '';
              const perksList = perksString ? perksString.split('•').map(p => p.trim()).filter(Boolean) : [];
              
              const venueCatUpper = String(venue.category || 'Nightlife').toUpperCase();
              const isBushParty = venueCatUpper.includes('BUSH') || venueCatUpper.includes('PARTY') || String(venue.name || '').toUpperCase().includes('BUSH');

              return (
                <div
                  key={venue.id || venue.name}
                  onClick={() => onSelect({ ...venue, price: basePrice })}
                  className="group/card relative bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                        isBushParty 
                          ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' 
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {isBushParty ? <Flame size={10} className="text-orange-400" /> : null}
                        {venue.category || 'Nightlife'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin size={12} className="text-amber-400" />
                        <span className="truncate max-w-[120px]">{venue.location || 'Excursion Base'}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover/card:text-amber-300 transition-colors">
                        {venue.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {venue.description || 'Exclusive evening venue offering curated entertainment and secure VIP access.'}
                      </p>
                    </div>

                    {perksList.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {perksList.map((perk: string, idx: number) => (
                          <span key={idx} className="text-[9px] bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded-md border border-white/5 flex items-center gap-1">
                            <ShieldCheck size={10} className="text-amber-400" />
                            {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 block font-bold">Base Investment</span>
                      <span className="text-xs font-black text-amber-400">
                        USD {basePrice.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">/ guest</span>
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 group-hover/card:bg-amber-400 group-hover/card:text-slate-950 text-amber-300 text-[10px] font-black tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-md">
                      <span>Select</span>
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <span>Tier: <strong className="text-amber-300 uppercase">{residencyTier}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}