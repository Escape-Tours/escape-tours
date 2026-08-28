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
import { Compass, Navigation, MapPin, Sparkles, Layers, ChevronUp, ChevronDown, Eye, Plane } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = dynamic(() => import('react-map-gl').then((mod) => mod.default), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 animate-pulse flex items-center justify-center"><Sparkles className="text-pink-400 animate-spin" size={28} /></div>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      // Intelligent Fallback: If it's Zanzibar / Seafront / Island, place it correctly in Zanzibar (-6.1659, 39.2026)
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
      
      const segmentKm = islandJump ? Math.max(Math.round(dist), 120) : Math.round(dist);
      totalKm += segmentKm;

      const currCoords: [number, number] = [curr.longitude, curr.latitude];
      const nextCoords: [number, number] = [next.longitude, next.latitude];
      
      const arc = createArcCoordinates(currCoords, nextCoords, islandJump);
      fullArcPath = fullArcPath.concat(arc);

      segments.push({
        from: curr.name,
        to: next.name,
        distanceText: islandJump ? 'Zanzibar Transfer' : `${segmentKm} km`,
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
        pitch: 35
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
        zoom: 12.5,
        pitch: 45,
        bearing: 15,
        essential: true,
        duration: 1800
      });
    }
  }, [hoveredId, validLocations, isLoaded]);

  const handleFlyTo = useCallback((id: string, lat: number, lng: number) => {
    const mapInstance = mapRef.current?.getMap?.() || mapRef.current;
    mapInstance?.flyTo({ 
      center: [lng, lat], 
      zoom: 13, 
      pitch: 45, 
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
        pitch: 35
      });
    }
  }, [bounds]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-pink-400 font-bold text-sm tracking-wider">
        Mapbox Access Token Missing
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-slate-950 border-2 border-indigo-500/30 rounded-3xl shadow-[0_20px_60px_rgba(79,70,229,0.3)]">
      
      {validLocations.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 backdrop-blur-2xl border border-pink-500/40 px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] flex items-center gap-5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 border border-pink-400/50 flex items-center justify-center text-white shadow-[0_0_20px_rgba(236,72,153,0.6)]">
              <Compass size={18} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black tracking-[0.2em] text-pink-400">Live Journey Tracker</p>
              <p className="text-xs font-black text-white tracking-tight">{routeData.totalKm} km <span className="text-cyan-400 font-bold">({validLocations.length} stops)</span></p>
            </div>
          </div>

          <div className="h-6 w-px bg-white/20" />

          <button
            type="button"
            onClick={handleFitRoute}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 transition-all cursor-pointer"
          >
            <Navigation size={13} />
            <span>Fit Route</span>
          </button>
        </div>
      )}

      <Map
        ref={mapRef}
        onLoad={() => setIsLoaded(true)}
        initialViewState={{ latitude: -3.3869, longitude: 36.683, zoom: 7 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-glow"
              type="line"
              source="route-source"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#ec4899',
                'line-width': 12,
                'line-opacity': 0.4,
                'line-blur': 8
              }}
            />
            <Layer
              id="route-line"
              type="line"
              source="route-source"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#06b6d4',
                'line-width': 4,
                'line-opacity': 0.95,
                'line-dasharray': [3, 2]
              }}
            />
          </Source>
        )}

        {routeData.segments.map((seg, idx) => (
          <Marker 
            key={`segment-${idx}`} 
            latitude={seg.midpoint[1]} 
            longitude={seg.midpoint[0]} 
            anchor="center"
          >
            <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 pointer-events-none">
              {seg.isIslandJump ? (
                <Plane size={11} className="text-pink-400" />
              ) : (
                <MapPin size={10} className="text-pink-400" />
              )}
              <span>{seg.distanceText}</span>
            </div>
          </Marker>
        ))}

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
                {isHovered && (
                  <span className="absolute -inset-3 rounded-full bg-pink-500/40 animate-ping pointer-events-none" />
                )}
                
                <div className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-4 border-slate-900 transition-all duration-300 flex items-center justify-center text-xs font-black shadow-2xl ${
                    isHovered 
                      ? 'bg-gradient-to-tr from-yellow-400 to-pink-500 text-slate-950 scale-125 shadow-[0_0_40px_rgba(236,72,153,1)] z-30' 
                      : 'bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:scale-110 group-hover:from-yellow-400 group-hover:to-pink-500 group-hover:text-slate-950'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className={`absolute -top-12 bg-slate-950/95 backdrop-blur-md text-white text-[11px] font-black px-4 py-1.5 rounded-xl transition-all duration-300 whitespace-nowrap shadow-2xl pointer-events-none border ${
                    isHovered 
                      ? 'opacity-100 scale-110 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.6)]' 
                      : 'opacity-0 group-hover:opacity-100 border-cyan-500/40'
                  }`}>
                    {loc.name}
                  </div>
                </div>
              </button>
            </Marker>
          );
        })}
      </Map>

      {validLocations.length > 0 && (
        <div className={`absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-20 bg-slate-950/90 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] transition-all duration-300 overflow-hidden`}>
          <div 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 cursor-pointer select-none border-b border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Layers size={16} className="text-pink-400" />
              <span className="text-xs font-black text-white tracking-wide uppercase">Itinerary Stops ({validLocations.length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
              <span>{isDrawerOpen ? 'Collapse' : 'Expand'}</span>
              {isDrawerOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>

          {isDrawerOpen && (
            <div className="max-h-60 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {validLocations.map((loc, idx) => {
                const isSelected = hoveredId === loc.id;
                return (
                  <div
                    key={`drawer-stop-${loc.id}-${idx}`}
                    onClick={() => handleFlyTo(loc.id, loc.latitude, loc.longitude)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="w-6 h-6 rounded-lg bg-indigo-900/80 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/30 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold tracking-tight truncate">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-pink-400 uppercase tracking-wider shrink-0 bg-pink-500/10 px-2 py-1 rounded-lg border border-pink-500/20">
                      <Eye size={12} />
                      <span>Fly to</span>
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