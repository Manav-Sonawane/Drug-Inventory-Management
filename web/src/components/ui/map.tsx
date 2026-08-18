'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


// ── Built-in Guaranteed Map Styles (Zero CORS / Zero API Key Failures) ─────────
export const DARK_MATTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const LIGHT_POSITRON_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-light': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CARTO',
    },
  },
  layers: [
    {
      id: 'carto-light-layer',
      type: 'raster',
      source: 'carto-light',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const VOYAGER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CARTO',
    },
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const MAP_STYLES = {
  dark: DARK_MATTER_STYLE,
  light: LIGHT_POSITRON_STYLE,
  voyager: VOYAGER_STYLE,
};

interface MapContextType {
  map: maplibregl.Map | null;
  isLoaded: boolean;
}

const MapContext = createContext<MapContextType>({ map: null, isLoaded: false });

export const useMap = () => useContext(MapContext);

export interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  theme?: 'dark' | 'light' | 'voyager';
  className?: string;
  children?: React.ReactNode;
  onLoad?: (map: maplibregl.Map) => void;
}

export function Map({
  center = [88.2000, 24.2000], // Centered over West Bengal, India
  zoom = 7,
  pitch = 0,
  bearing = 0,
  theme = 'dark',
  className = 'w-full h-full min-h-[480px]',
  children,
  onLoad,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeStyle = MAP_STYLES[theme] || DARK_MATTER_STYLE;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: activeStyle,
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      attributionControl: false,
    });

    mapInstance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    const markLoaded = () => {
      setIsLoaded(true);
      if (onLoad) onLoad(mapInstance);
      mapInstance.resize();
    };

    mapInstance.on('load', markLoaded);

    // Fallback load trigger if load event fired earlier or takes time
    mapInstance.on('styledata', () => {
      if (!isLoaded) markLoaded();
    });

    // Ensure map container resizes dynamically
    const timer = setTimeout(() => {
      mapInstance.resize();
      setIsLoaded(true);
    }, 200);

    setMap(mapInstance);

    return () => {
      clearTimeout(timer);
      mapInstance.remove();
    };
  }, []);

  // Update map style when theme changes dynamically
  useEffect(() => {
    if (map) {
      map.setStyle(activeStyle);
    }
  }, [theme]);

  return (
    <MapContext.Provider value={{ map, isLoaded }}>
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        {isLoaded && children}
      </div>
    </MapContext.Provider>
  );
}

// ── MapMarker Component (MapCN composable marker) ─────────────────────────────────
export interface MapMarkerProps {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MapMarker({ longitude, latitude, children, onClick, className = '' }: MapMarkerProps) {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    if (!map || !isLoaded) return;

    const el = containerRef.current;
    el.className = `mapcn-marker cursor-pointer ${className}`;
    if (onClick) {
      el.onclick = (e) => {
        e.stopPropagation();
        onClick();
      };
    }

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, isLoaded, longitude, latitude, onClick, className]);

  if (!isLoaded || !map || !children) return null;

  return createPortal(children, containerRef.current);
}


// ── MapRoute Component (MapCN composable GeoJSON line layer) ──────────────────────
export interface MapRouteProps {
  id: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  dashed?: boolean;
}

export function MapRoute({ id, coordinates, color = '#3b82f6', width = 3, dashed = false }: MapRouteProps) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const sourceId = `route-source-${id}`;
    const layerId = `route-layer-${id}`;

    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    };

    const addOrUpdateRoute = () => {
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': width,
            'line-opacity': 0.85,
            ...(dashed ? { 'line-dasharray': [2, 2] } : {}),
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      addOrUpdateRoute();
    } else {
      map.once('styledata', addOrUpdateRoute);
    }

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (e) {
        // ignore cleanup error if map already destroyed
      }
    };
  }, [map, isLoaded, id, coordinates, color, width, dashed]);

  return null;
}
