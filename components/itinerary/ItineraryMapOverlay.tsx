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
  Route,
  Activity,
  Zap,
  ShieldCheck,
  Globe2,
  Gauge,
  Clock
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
      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-pink-400 animate-pulse">Initializing Magnificent Safari Radar...</p>
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
  dayNumber?: number;
  type?: 'safari' | 'hotel' | 'flight' | 'cultural' | 'island';
}

interface MapOverlayProps {
  locations: Location[];
  hoveredId?: string | null;
  onSelectStop?: (id: string) => void;
}

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
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
    lower.includes('zanzique') ||
    lower.includes('airport znz')
  );
};

const createArcCoordinates = (start: [number, number], end: [number, number], isIslandJump: boolean, points = 50) => {
  const arc: [number, number][] = [];
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const lng = lng1 + (lng2 - lng1) * t;
    const lat = lat1 + (lat2 - lat1) * t;
    const dist = calculateDistance(lat1, lng1, lat2, lng2);
    const curveFactor = isIslandJump ? 0.025 : 0.003;
    const curveOffset = Math.sin(t * Math.PI) * Math.min(dist * curveFactor, isIslandJump ? 2.2 : 0.5);
    arc.push([lng, lat + curveOffset]);
  }
  return arc;
};

export const ItineraryMapOverlay = memo(({ locations, hoveredId, onSelectStop }: MapOverlayProps) => {
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapStyleMode, setMapStyleMode] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [activeTab, setActiveTab] = useState<'route' | 'telemetry'>('route');

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
          dayNumber: l.dayNumber || index + 1,
          type: l.type || (isZanzibarLocation(l.name) ? 'island' : 'safari')
        };
      }

      const isZanzibar = isZanzibarLocation(l.name);
      const defaultLat = isZanzibar ? -6.1659 : -3.3869 - (index * 0.08);
      const defaultLng = isZanzibar ? 39.2026 : 36.683 + (index * 0.08);

      return {
        id: l.id || `loc-${index}`,
        name: l.name || `Stop ${index + 1}`,
        latitude: defaultLat,
        longitude: defaultLng,
        dayNumber: l.dayNumber || index + 1,
        type: l.type || (isZanzibar ? 'island' : 'safari')
      };
    });
  }, [locations]);

  const routeData = useMemo(() => {
    if (validLocations.length < 2) return { totalKm: 0, totalHours: 0, segments: [], arcCoordinates: [] };
    let totalKm = 0;
    let totalHours = 0;
    const segments: Array<{ from: string; to: string; distanceText: string; timeText: string; isIslandJump: boolean; midpoint: [number, number] }> = [];
    let fullArcPath: [number, number][] = [];

    for (let i = 0; i < validLocations.length - 1; i++) {
      const curr = validLocations[i];
      const next = validLocations[i + 1];
      
      const islandJump = isZanzibarLocation(curr.name) || isZanzibarLocation(next.name);
      const dist = calculateDistance(curr.latitude, curr.longitude, next.latitude, next.longitude);
      
      const actualRoadKm = islandJump ? Math.round(dist) : Math.round(dist * 7.8);
      totalKm += actualRoadKm;

      const speedKmh = islandJump ? 300 : 50; 
      const hours = actualRoadKm / speedKmh;
      totalHours += hours;

      const currCoords: [number, number] = [curr.longitude, curr.latitude];
      const nextCoords: [number, number] = [next.longitude, next.latitude];
      
      const arc = createArcCoordinates(currCoords, nextCoords, islandJump);
      fullArcPath = fullArcPath.concat(arc);

      const segmentMins = Math.round(hours * 60);
      const timeText = segmentMins < 60 ? `${segmentMins} mins` : `${hours.toFixed(1)} hrs`;

      segments.push({
        from: curr.name,
        to: next.name,
        distanceText: `${actualRoadKm} km`,
        timeText,
        isIslandJump: islandJump,
        midpoint: [(curr.longitude + next.longitude) / 2, (curr.latitude + next.latitude) / 2]
      });
    }

    return { 
      totalKm: Math.round(totalKm), 
      totalHours: Number(totalHours.toFixed(1)), 
      segments, 
      arcCoordinates: fullArcPath 
    };
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
        padding: { top: 120, bottom: 120, left: 100, right: 100 }, 
        duration: 2200, 
        essential: true,
        pitch: 50,
        bearing: 15
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
        zoom: 14,
        pitch: 60,
        bearing: 30,
        essential: true,
        duration: 1800
      });
    }
  }, [hoveredId, validLocations, isLoaded]);

  const handleFlyTo = useCallback((id: string, lat: number, lng: number) => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    mapInstance?.flyTo({ 
      center: [lng, lat], 
      zoom: 14, 
      pitch: 60, 
      bearing: 25,
      essential: true, 
      duration: 1600 
    });
    if (onSelectStop) onSelectStop(id);
  }, [onSelectStop]);

  const handleFitRoute = useCallback(() => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    if (bounds && mapInstance) {
      mapInstance.fitBounds(bounds, { 
        padding: { top: 120, bottom: 120, left: 100, right: 100 }, 
        duration: 1800, 
        essential: true,
        pitch: 50
      });
    }
  }, [bounds]);

  const getMapStyleUrl = () => {
    switch (mapStyleMode) {
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'dark': return 'mapbox://styles/mapbox/dark-v11';
      default: return 'mapbox://styles/mapbox/navigation-night-v1';
    }
  };

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-950 border border-pink-500/20 rounded-[2.5rem] p-6 shadow-2xl">
        <Compass className="text-pink-500 animate-pulse" size={40} />
        <p className="text-pink-400 font-extrabold text-xs uppercase tracking-widest">Mapbox Token Missing</p>
        <p className="text-[11px] text-slate-400 text-center max-w-xs">Please configure your NEXT_PUBLIC_MAPBOX_TOKEN environment variable.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[700px] max-h-[calc(100vh-140px)] overflow-hidden bg-slate-950 border border-indigo-500/30 rounded-[2.5rem] shadow-[0_30px_90px_rgba(15,23,42,0.95)] group flex flex-col">
      
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {validLocations.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/90 backdrop-blur-2xl border border-pink-500/40 px-4 py-2.5 rounded-2xl shadow-[0_20px_60px_rgba(236,72,153,0.3)] flex items-center gap-3 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 animate-pulse opacity-70" />
              <div className="relative w-8 h-8 rounded-xl bg-slate-950 border border-pink-400/50 flex items-center justify-center text-white shadow-inner">
                <Radio size={14} className="text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <p className="text-[8px] uppercase font-black tracking-[0.3em] text-pink-400">Live Telemetry</p>
              </div>
              <p className="text-[11px] font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{routeData.totalKm} km Expedition</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400">~{routeData.totalHours} hrs transit</span>
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setMapStyleMode('streets')}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapStyleMode === 'streets' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Navigation
            </button>
            <button
              type="button"
              onClick={() => setMapStyleMode('satellite')}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapStyleMode === 'satellite' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapStyleMode('dark')}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapStyleMode === 'dark' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Dark Ops
            </button>
          </div>

          <button
            type="button"
            onClick={handleFitRoute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-[9px] font-black tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Navigation size={12} />
            <span>Fit All</span>
          </button>
        </div>
      )}

      <div className="relative w-full flex-1 min-h-[500px]">
        <Map
          ref={mapRef}
          onLoad={() => setIsLoaded(true)}
          initialViewState={{ latitude: -3.3869, longitude: 36.683, zoom: 7 }}
          mapStyle={getMapStyleUrl()}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          attributionControl={false}
        >
          <NavigationControl position="top-right" />

          {routeGeoJSON && (
            <Source id="magnificent-route-source" type="geojson" data={routeGeoJSON}>
              <Layer
                id="route-outer-glow"
                type="line"
                source="magnificent-route-source"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#ec4899',
                  'line-width': 16,
                  'line-opacity': 0.4,
                  'line-blur': 12
                }}
              />
              <Layer
                id="route-inner-core"
                type="line"
                source="magnificent-route-source"
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

          {routeData.segments.map((seg, idx) => (
            <Marker 
              key={`seg-marker-${idx}`} 
              latitude={seg.midpoint[1]} 
              longitude={seg.midpoint[0]} 
              anchor="center"
            >
              <div className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-400/70 text-cyan-300 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2 pointer-events-none transform -translate-y-2">
                {seg.isIslandJump ? (
                  <Plane size={11} className="text-pink-400 animate-bounce" />
                ) : (
                  <Route size={11} className="text-pink-400" />
                )}
                <span>{seg.distanceText}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300">{seg.timeText}</span>
              </div>
            </Marker>
          ))}

          {validLocations.map((loc, index) => {
            const isHovered = hoveredId === loc.id;
            return (
              <Marker 
                key={`magnificent-marker-${loc.id}-${index}`} 
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
                  {isHovered && (
                    <span className="absolute -inset-5 rounded-full bg-pink-500/60 animate-ping pointer-events-none" />
                  )}
                  
                  <div className="relative flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl border-2 border-slate-950 transition-all duration-300 flex items-center justify-center text-xs font-black shadow-2xl transform group-hover:-translate-y-1 ${
                      isHovered 
                        ? 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-slate-950 scale-125 shadow-[0_0_50px_rgba(236,72,153,1)] z-40 ring-4 ring-pink-400/50 rotate-6' 
                        : 'bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.8)] group-hover:scale-110 group-hover:from-amber-400 group-hover:to-pink-500 group-hover:text-slate-950'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className={`absolute -top-14 bg-slate-950/95 backdrop-blur-2xl text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap shadow-2xl pointer-events-none border ${
                      isHovered 
                        ? 'opacity-100 scale-110 border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.8)]' 
                        : 'opacity-0 group-hover:opacity-100 border-cyan-500/40'
                    }`}>
                      <span className="text-pink-400 mr-1.5 font-mono">Day {loc.dayNumber || index + 1}</span> 
                      <span>{loc.name}</span>
                    </div>
                  </div>
                </button>
              </Marker>
            );
          })}
        </Map>

        {validLocations.length > 0 && (
          <div className="absolute bottom-4 right-4 z-30 w-[380px] bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] transition-all duration-300 overflow-hidden flex flex-col max-h-[50vh]">
            
            <div className="bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-950/90 px-4 pt-3.5 pb-2.5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-inner">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white tracking-wide uppercase">Expedition Command</h4>
                  <p className="text-[9px] text-cyan-400 font-mono">Precision GPS Active</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
                <button 
                  type="button"
                  onClick={() => setActiveTab('route')}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'route' ? 'bg-pink-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Stops
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'telemetry' ? 'bg-pink-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Metrics
                </button>
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
              {activeTab === 'route' ? (
                <div className="space-y-2">
                  {validLocations.map((loc, idx) => {
                    const isSelected = hoveredId === loc.id;
                    return (
                      <div
                        key={`drawer-loc-${loc.id}-${idx}`}
                        onClick={() => handleFlyTo(loc.id, loc.latitude, loc.longitude)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                          isSelected 
                            ? 'bg-gradient-to-r from-pink-500/30 via-purple-600/30 to-indigo-600/30 border-pink-400 text-white shadow-[0_0_30px_rgba(236,72,153,0.5)]' 
                            : 'bg-slate-900/70 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <span className={`w-7 h-7 rounded-xl text-[11px] font-black flex items-center justify-center shrink-0 border transition-all ${
                            isSelected 
                              ? 'bg-pink-500 text-slate-950 border-pink-300 shadow-md' 
                              : 'bg-indigo-950 text-cyan-400 border-cyan-500/30 group-hover:border-pink-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] font-mono uppercase tracking-wider text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">
                                Day {loc.dayNumber || idx + 1}
                              </span>
                              <p className="text-[11px] font-bold tracking-tight truncate group-hover:text-white transition-colors">{loc.name}</p>
                            </div>
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                              Lat: {Number(loc.latitude).toFixed(3)}°, Lng: {Number(loc.longitude).toFixed(3)}°
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] font-black text-pink-400 uppercase tracking-wider shrink-0 bg-pink-500/10 px-2.5 py-1.5 rounded-xl border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-slate-950 transition-all">
                          <Eye size={12} />
                          <span>Fly</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5 py-1">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1.5 text-pink-400 mb-1">
                        <Gauge size={14} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Total Distance</span>
                      </div>
                      <p className="text-base font-black text-white">{routeData.totalKm} <span className="text-[10px] font-normal text-slate-400">KM</span></p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                        <Clock size={14} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Est. Transit</span>
                      </div>
                      <p className="text-base font-black text-white">{routeData.totalHours} <span className="text-[10px] font-normal text-slate-400">Hours</span></p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-3 rounded-2xl border border-indigo-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <ShieldCheck size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white">GPS Accuracy Locked</p>
                        <p className="text-[9px] text-slate-400 font-mono">Real-time waypoint verification active</p>
                      </div>
                    </div>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ItineraryMapOverlay.displayName = 'ItineraryMapOverlay';
export default ItineraryMapOverlay;