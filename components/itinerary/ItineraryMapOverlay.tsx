// components/ItineraryMapOverlay.tsx
'use client';

import React, { useRef, useEffect, useCallback, useMemo, memo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LngLatBoundsLike } from 'mapbox-gl';
import type { 
  MapInstance, 
  MapComponentProps, 
  MapMarkerProps, 
  MapNavProps 
} from '@/lib/types/map-types';
import { 
  Compass, 
  Navigation, 
  MapPin, 
  Sparkles, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Plane, 
  Radio, 
  Maximize2,
  Route
} from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = dynamic(() => import('react-map-gl').then((mod) => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 shadow-2xl flex items-center justify-center relative">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Compass className="text-pink-400 animate-spin" size={32} />
          </div>
        </div>
      </div>
      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-pink-400 animate-pulse">Initializing Safari Radar...</p>
    </div>
  )
}) as React.ComponentType<MapComponentProps & { children: React.ReactNode }>;

const NavigationControl = dynamic(() => import('react-map-gl').then((mod) => mod.NavigationControl), { 
  ssr: false 
}) as React.ComponentType<MapNavProps>;

const Marker = dynamic(() => import('react-map-gl').then((mod) => mod.Marker), { 
  ssr: false 
}) as React.ComponentType<MapMarkerProps>;

const Source = dynamic(() => import('react-map-gl').then((mod) => mod.Source), { ssr: false }) as any;
const Layer = dynamic(() => import('react-map-gl').then((mod) => mod.Layer), { ssr: false }) as any;

interface Location {
  id: string;
  name: string;
  latitude?: number | null | string;
  longitude?: number | null | string;
}

interface MapOverlayProps {
  locations: Location[];
  hoveredId?: string | null;
  onSelectStop?: (id: string) => void;
}

// Haversine formula returning precise distance in Kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

const isZanzibarLocation = (name: string) => {
  const lower = (name || '').toLowerCase();
  return (
    lower.includes('zanzibar') ||
    lower.includes('stone town') ||
    lower.includes('nungwi') ||
    lower.includes('kendwa') ||
    lower.includes('paje') ||
    lower.includes('matemwe') ||
    lower.includes('seafront') ||
    lower.includes('zanzique')
  );
};

const createArcCoordinates = (start: [number, number], end: [number, number], isIslandJump: boolean, points = 40) => {
  const arc: [number, number][] = [];
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const lng = lng1 + (lng2 - lng1) * t;
    const lat = lat1 + (lat2 - lat1) * t;
    const dist = calculateDistance(lat1, lng1, lat2, lng2);
    const curveFactor = isIslandJump ? 0.015 : 0.002;
    const curveOffset = Math.sin(t * Math.PI) * Math.min(dist * curveFactor, isIslandJump ? 1.5 : 0.4);
    arc.push([lng, lat + curveOffset]);
  }
  return arc;
};

export const ItineraryMapOverlay = memo(({ locations, hoveredId, onSelectStop }: MapOverlayProps) => {
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [mapStyleMode, setMapStyleMode] = useState<'streets' | 'satellite'>('streets');

  useEffect(() => {
    console.log('[ItineraryMapOverlay] Received locations:', locations);
  }, [locations]);

  const validLocations = useMemo(() => {
    if (!locations || !Array.isArray(locations)) return [];
    
    return locations.map((l, index) => {
      const lat = typeof l.latitude === 'string' ? parseFloat(l.latitude) : l.latitude;
      const lng = typeof l.longitude === 'string' ? parseFloat(l.longitude) : l.longitude;

      const hasValidCoords = typeof lat === 'number' && !isNaN(lat) && lat !== 0 &&
                             typeof lng === 'number' && !isNaN(lng) && lng !== 0;

      if (hasValidCoords) {
        return {
          id: l.id || `loc-${index}`,
          name: l.name || `Stop ${index + 1}`,
          latitude: lat,
          longitude: lng,
        };
      }

      const isZanzibar = isZanzibarLocation(l.name);
      const defaultLat = isZanzibar ? -6.1659 : -3.3869 - (index * 0.05);
      const defaultLng = isZanzibar ? 39.2026 : 36.683 + (index * 0.05);

      return {
        id: l.id || `loc-${index}`,
        name: l.name || `Stop ${index + 1}`,
        latitude: defaultLat,
        longitude: defaultLng,
      };
    });
  }, [locations]);

  const routeData = useMemo(() => {
    if (validLocations.length < 2) return { totalKm: 0, segments: [], arcCoordinates: [] };
    let totalKm = 0;
    const segments: Array<{ from: string; to: string; distanceText: string; isIslandJump: boolean; midpoint: [number, number] }> = [];
    let fullArcPath: [number, number][] = [];

    for (let i = 0; i < validLocations.length - 1; i++) {
      const curr = validLocations[i];
      const next = validLocations[i + 1];
      
      const islandJump = isZanzibarLocation(curr.name) || isZanzibarLocation(next.name);
      const dist = calculateDistance(curr.latitude, curr.longitude, next.latitude, next.longitude);
      
      // Removed artificial capping/flooring to allow exact true-to-life geographic distances
      const segmentKm = Math.round(dist);
      totalKm += segmentKm;

      const currCoords: [number, number] = [curr.longitude, curr.latitude];
      const nextCoords: [number, number] = [next.longitude, next.latitude];
      
      const arc = createArcCoordinates(currCoords, nextCoords, islandJump);
      fullArcPath = fullArcPath.concat(arc);

      segments.push({
        from: curr.name,
        to: next.name,
        distanceText: islandJump && segmentKm < 50 ? 'Flight Transfer' : `${segmentKm} km`,
        isIslandJump: islandJump,
        midpoint: [(curr.longitude + next.longitude) / 2, (curr.latitude + next.latitude) / 2]
      });
    }

    return { totalKm: Math.round(totalKm), segments, arcCoordinates: fullArcPath };
  }, [validLocations]);

  const routeGeoJSON = useMemo(() => {
    if (routeData.arcCoordinates.length < 2) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeData.arcCoordinates
      }
    };
  }, [routeData.arcCoordinates]);

  const bounds = useMemo(() => {
    if (!validLocations.length) return null;
    const lats = validLocations.map(l => l.latitude);
    const lngs = validLocations.map(l => l.longitude);
    return [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)]
    ] as LngLatBoundsLike;
  }, [validLocations]);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    if (bounds && mapInstance && isLoaded && !hoveredId) {
      mapInstance.fitBounds(bounds, { 
        padding: { top: 120, bottom: 140, left: 100, right: 100 }, 
        duration: 2000, 
        essential: true,
        pitch: 45
      });
    }
  }, [bounds, isLoaded, hoveredId]);

  useEffect(() => {
    if (!hoveredId || !isLoaded) return;
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    if (!mapInstance) return;

    const targetLoc = validLocations.find(l => l.id === hoveredId);
    if (targetLoc) {
      mapInstance.flyTo({
        center: [targetLoc.longitude, targetLoc.latitude],
        zoom: 13.5,
        pitch: 55,
        bearing: 20,
        essential: true,
        duration: 1800
      });
    }
  }, [hoveredId, validLocations, isLoaded]);

  const handleFlyTo = useCallback((id: string, lat: number, lng: number) => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    mapInstance?.flyTo({ 
      center: [lng, lat], 
      zoom: 13.5, 
      pitch: 55, 
      bearing: 15,
      essential: true, 
      duration: 1500 
    });
    if (onSelectStop) onSelectStop(id);
  }, [onSelectStop]);

  const handleFitRoute = useCallback(() => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    if (bounds && mapInstance) {
      mapInstance.fitBounds(bounds, { 
        padding: { top: 120, bottom: 140, left: 100, right: 100 }, 
        duration: 1500, 
        essential: true,
        pitch: 45
      });
    }
  }, [bounds]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-950 border border-pink-500/20 rounded-3xl p-6">
        <Compass className="text-pink-500 animate-pulse" size={36} />
        <p className="text-pink-400 font-extrabold text-xs uppercase tracking-widest">Mapbox Token Missing</p>
        <p className="text-[11px] text-slate-400">Please configure NEXT_PUBLIC_MAPBOX_TOKEN in your environment.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[750px] overflow-hidden bg-slate-950 border border-indigo-500/30 rounded-[2.5rem] shadow-[0_25px_70px_rgba(15,23,42,0.9)] group">
      
      {/* Background Neon Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Telemetry & Controls Header */}
      {validLocations.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-950/85 backdrop-blur-2xl border border-pink-500/40 px-6 py-3 rounded-2xl shadow-[0_15px_50px_rgba(236,72,153,0.25)] flex items-center gap-5 transition-all">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 animate-pulse opacity-70" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-950 border border-pink-400/50 flex items-center justify-center text-white shadow-inner">
                <Radio size={16} className="text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <p className="text-[9px] uppercase font-black tracking-[0.25em] text-pink-400">Live Telemetry</p>
              </div>
              <p className="text-xs font-black text-white tracking-tight">
                {routeData.totalKm} km Total <span className="text-cyan-400 font-bold">({validLocations.length} Waypoints)</span>
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Style Toggle */}
          <button
            type="button"
            onClick={() => setMapStyleMode(prev => prev === 'streets' ? 'satellite' : 'streets')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:border-pink-400/50 transition-all cursor-pointer"
          >
            <span>{mapStyleMode === 'streets' ? '🛰️ Satellite' : '🗺️ Streets'}</span>
          </button>

          <button
            type="button"
            onClick={handleFitRoute}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Navigation size={13} />
            <span>Fit Route</span>
          </button>
        </div>
      )}

      {/* Mapbox Instance */}
      <Map
        ref={mapRef}
        onLoad={() => setIsLoaded(true)}
        initialViewState={{ latitude: -3.3869, longitude: 36.683, zoom: 7 }}
        mapStyle={mapStyleMode === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/navigation-night-v1'}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {/* Glowing Flight & Drive Route Lines */}
        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-glow"
              type="line"
              source="route-source"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#ec4899',
                'line-width': 14,
                'line-opacity': 0.45,
                'line-blur': 10
              }}
            />
            <Layer
              id="route-line"
              type="line"
              source="route-source"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#38bdf8',
                'line-width': 4.5,
                'line-opacity': 0.95,
                'line-dasharray': [3, 2]
              }}
            />
          </Source>
        )}

        {/* Segment Badges along the path */}
        {routeData.segments.map((seg, idx) => (
          <Marker 
            key={`segment-${idx}`} 
            latitude={seg.midpoint[1]} 
            longitude={seg.midpoint[0]} 
            anchor="center"
          >
            <div className="bg-slate-950/90 backdrop-blur-xl border border-cyan-400/60 text-cyan-300 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5 pointer-events-none transform -translate-y-2">
              {seg.isIslandJump ? (
                <Plane size={11} className="text-pink-400 animate-bounce" />
              ) : (
                <Route size={10} className="text-pink-400" />
              )}
              <span>{seg.distanceText}</span>
            </div>
          </Marker>
        ))}

        {/* Location Markers */}
        {validLocations.map((loc, index) => {
          const isHovered = hoveredId === loc.id;
          return (
            <Marker 
              key={`marker-${loc.id}-${index}`} 
              latitude={loc.latitude} 
              longitude={loc.longitude} 
              anchor="bottom"
            >
              <button 
                type="button"
                className="group cursor-pointer focus:outline-none relative"
                onClick={() => handleFlyTo(loc.id, loc.latitude, loc.longitude)}
                aria-label={`Fly to ${loc.name}`}
              >
                {/* Radar Ping Effect when Hovered */}
                {isHovered && (
                  <span className="absolute -inset-4 rounded-full bg-pink-500/50 animate-ping pointer-events-none" />
                )}
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full border-2 border-slate-950 transition-all duration-300 flex items-center justify-center text-xs font-black shadow-2xl ${
                    isHovered 
                      ? 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-slate-950 scale-125 shadow-[0_0_40px_rgba(236,72,153,1)] z-30 ring-4 ring-pink-400/40' 
                      : 'bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:scale-110 group-hover:from-amber-400 group-hover:to-pink-500 group-hover:text-slate-950'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Floating Marker Label Badge */}
                  <div className={`absolute -top-12 bg-slate-950/95 backdrop-blur-xl text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap shadow-2xl pointer-events-none border ${
                    isHovered 
                      ? 'opacity-150 scale-110 border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.7)]' 
                      : 'opacity-0 group-hover:opacity-100 border-cyan-500/40'
                  }`}>
                    <span className="text-pink-400 mr-1.5">#{index + 1}</span> {loc.name}
                  </div>
                </div>
              </button>
            </Marker>
          );
        })}
      </Map>

      {/* Interactive Itinerary Stops Drawer (Bottom Right) */}
      {validLocations.length > 0 && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-20 bg-slate-950/90 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-300 overflow-hidden">
          <div 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-950/90 cursor-pointer select-none border-b border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Layers size={15} />
              </div>
              <div>
                <span className="text-xs font-black text-white tracking-wide uppercase">Itinerary Waypoints</span>
                <p className="text-[10px] text-slate-400 font-mono">Total Stops: {validLocations.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
              <span>{isDrawerOpen ? 'Collapse' : 'Expand'}</span>
              {isDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          </div>

          {isDrawerOpen && (
            <div className="max-h-64 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {validLocations.map((loc, idx) => {
                const isSelected = hoveredId === loc.id;
                return (
                  <div
                    key={`drawer-stop-${loc.id}-${idx}`}
                    onClick={() => handleFlyTo(loc.id, loc.latitude, loc.longitude)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-gradient-to-r from-pink-500/25 via-purple-600/25 to-indigo-600/25 border-pink-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 border transition-all ${
                        isSelected 
                          ? 'bg-pink-500 text-slate-950 border-pink-300 shadow-md' 
                          : 'bg-indigo-950 text-cyan-400 border-cyan-500/30 group-hover:border-pink-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold tracking-tight truncate group-hover:text-white transition-colors">{loc.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">
                          {Number(loc.latitude).toFixed(3)}°, {Number(loc.longitude).toFixed(3)}°
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-pink-400 uppercase tracking-wider shrink-0 bg-pink-500/10 px-2.5 py-1.5 rounded-lg border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-slate-950 transition-all">
                      <Eye size={12} />
                      <span>Fly</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ItineraryMapOverlay.displayName = 'ItineraryMapOverlay';
export default ItineraryMapOverlay;