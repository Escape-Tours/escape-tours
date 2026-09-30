"use client";

import { useState, useRef, useEffect } from "react";

interface DynamicLocationInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const instantFallbackLocations = [
  "Julius Nyerere International Airport (DAR) - Dar es Salaam",
  "Kilimanjaro International Airport (JRO) - Arusha/Moshi",
  "Abeid Amani Karume International Airport (ZNZ) - Zanzibar",
  "Arusha Airport (ARK) - Arusha",
  "Serengeti National Park (Seronera)",
  "Ngorongoro Crater Conservation Area",
  "Arusha City Center",
  "Stone Town, Zanzibar",
  "Serena Hotel",
  "Arusha Serena Hotel",
  "Zanzibar Serena Hotel",
  "Serengeti Serena Safari Lodge"
];

export default function DynamicLocationInput({ placeholder, value, onChange }: DynamicLocationInputProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync value prop
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Update fixed position coordinates based on input layout
  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Filter suggestions instantly
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setDropdownStyle(null);
      return;
    }

    const matches = instantFallbackLocations.filter(item =>
      item.toLowerCase().includes(trimmed)
    );
    setSuggestions(matches);
    updateCoords();
  }, [query]);

  // Close dropdown on outside click or scroll/resize
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
        setDropdownStyle(null);
      }
    }
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        onFocus={() => {
          if (query.trim()) {
            const matches = instantFallbackLocations.filter(item =>
              item.toLowerCase().includes(query.trim().toLowerCase())
            );
            setSuggestions(matches);
            updateCoords();
          }
        }}
        className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-sm px-2 py-1"
      />

      {/* Rendered via fixed positioning to completely escape parent overflow bounds */}
      {query.trim().length > 0 && suggestions.length > 0 && dropdownStyle && (
        <ul
          style={{
            top: `${dropdownStyle.top}px`,
            left: `${dropdownStyle.left}px`,
            width: `${dropdownStyle.width}px`,
          }}
          className="fixed z-[999999] max-h-60 overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl backdrop-blur-md"
        >
          {suggestions.map((location, index) => (
            <li
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(location);
                setSuggestions([]);
                setDropdownStyle(null);
                if (onChange) onChange(location);
              }}
              className="px-4 py-2.5 text-sm text-zinc-200 hover:bg-amber-500/20 hover:text-amber-400 cursor-pointer transition-colors border-b border-zinc-800 last:border-none"
            >
              📍 {location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}