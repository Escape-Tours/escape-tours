'use client';
import { useState } from 'react';
import { TANZANIA_LOCATIONS, LocationItem } from '@/lib/constants/tanzania-locations';

export default function LocationSearch({ label, onSelect }: { label: string, onSelect: (item: LocationItem) => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocations = query === '' 
    ? TANZANIA_LOCATIONS.slice(0, 6) 
    : TANZANIA_LOCATIONS.filter((item: LocationItem) => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.region.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="relative w-full">
      <label className="text-xs uppercase text-amber-500 font-semibold mb-1 block">{label}</label>
      <input 
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search airport, park, or hotel..."
        className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500"
      />

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((item: LocationItem) => (
              <div 
                key={item.id}
                onClick={() => {
                  setQuery(item.name);
                  setIsOpen(false);
                  onSelect(item);
                }}
                className="p-3 hover:bg-amber-500/10 cursor-pointer border-b border-neutral-800 flex justify-between items-center text-sm"
              >
                <div>
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="block text-xs text-neutral-400">{item.region} Region</span>
                </div>
                <span className="text-[10px] bg-neutral-800 text-amber-400 px-2 py-0.5 rounded uppercase">
                  {item.category}
                </span>
              </div>
            ))
          ) : (
            <div className="p-3 text-xs text-neutral-500 text-center">No matching locations found in Tanzania</div>
          )}
        </div>
      )}
    </div>
  );
}