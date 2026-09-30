'use client';

import React, { useState, useRef, useEffect } from 'react';

interface LocationAutocompleteProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export default function LocationAutocomplete({
  placeholder,
  icon,
  value,
  onChange,
  suggestions,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center bg-[#14120e] border border-[#2d2820] focus-within:border-[#d4af37] transition-all rounded-xl px-4 py-3.5 shadow-inner">
        <span className="text-[#d4af37] mr-3 text-lg">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[#f5f2eb] placeholder-[#7a7265] text-sm focus:outline-none font-medium"
        />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-[#191611] border border-[#2d2820] rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-md">
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(item);
                setIsOpen(false);
              }}
              className="px-4 py-3 text-sm text-[#d4cbd3] hover:text-[#d4af37] hover:bg-[#231f18] cursor-pointer transition-colors border-b border-[#231f18] last:border-none flex items-center justify-between"
            >
              <span>{item}</span>
              <span className="text-xs text-[#7a7265] tracking-wider uppercase">Select</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}