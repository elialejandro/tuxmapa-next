'use client';

// ============================================================
// MapView — Leaflet Map Component
// ============================================================
// Renders a full-screen Leaflet map centered on Tuxtla Gutiérrez.
// Handles map clicks and emits coordinates based on current mode.
// Polylines and circles are rendered via sub-components in Phase 3.

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapState } from '@/hooks/useMapState';
import { decodePolyline } from '@/lib/polyline';
import { POLYLINE_COLORS, CIRCLE_COLORS } from '@/lib/polyline';

const DEFAULT_CENTER: [number, number] = [16.756386, -93.132305]; // Tuxtla Gutiérrez
const DEFAULT_ZOOM = 13;

// ── Map Tile Configuration ─────────────────────────────────
type MapProvider = 'thunderforest' | 'openstreetmap';

interface TileConfig {
  url: string;
  attribution: string;
  maxZoom: number;
}

const getTileConfig = (): TileConfig => {
  const provider = (process.env.NEXT_PUBLIC_MAP_PROVIDER || 'openstreetmap') as MapProvider;
  const apikey = process.env.NEXT_PUBLIC_THUNDERFOREST_APIKEY || '';

  if (provider === 'thunderforest' && apikey) {
    return {
      url: 'https://{s}.api.thunderforest.com/atlas/{z}/{x}/{y}{r}.png?apikey=' + apikey,
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 22,
    };
  }

  // Default: OpenStreetMap (no API key required)
  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  };
};

// Fix Leaflet default icon paths in Next.js
const fixLeafletIcons = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface MapViewProps {
  onMapClick?: (lat: number, lng: number) => void;
}

export default function MapView({ onMapClick }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  const {
    mode,
    selectedRoute,
    polylines,
    punto1,
    punto2,
    cruce,
    mejorRutaResult,
  } = useMapState();

  // ── Initialize Leaflet Map ───────────────────────────────

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    fixLeafletIcons();

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    // Tile Layer — uses env vars to switch between Thunderforest (prod) and OSM (local dev)
    const tileConfig = getTileConfig();
    L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    // Map click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render Polylines ─────────────────────────────────────

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing polylines
    polylinesRef.current.forEach((p) => p.remove());
    polylinesRef.current = [];

    // Clear existing circles
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    // Render route polylines (from selectedRoute)
    if (selectedRoute?.puntos) {
      const { lado_uno, lado_dos } = selectedRoute.puntos;

      if (lado_uno) {
        const coords1 = decodePolyline(lado_uno);
        if (coords1.length > 0) {
          const polyline1 = L.polyline(coords1, {
            color: POLYLINE_COLORS.ladoUno,
            weight: POLYLINE_COLORS.strokeWeight,
          }).addTo(map);
          polylinesRef.current.push(polyline1);
        }
      }

      if (lado_dos) {
        const coords2 = decodePolyline(lado_dos);
        if (coords2.length > 0) {
          const polyline2 = L.polyline(coords2, {
            color: POLYLINE_COLORS.ladoDos,
            weight: POLYLINE_COLORS.strokeWeight,
          }).addTo(map);
          polylinesRef.current.push(polyline2);
        }
      }
    }

    // Render mejor_ruta polylines (iterate over array of results)
    if (mejorRutaResult && mejorRutaResult.length > 0) {
      mejorRutaResult.forEach((result) => {
        result.rutas.forEach((ruta) => {
          const coords = decodePolyline(ruta.puntos);
          if (coords.length > 0) {
            const polyline = L.polyline(coords, {
              color: POLYLINE_COLORS.ladoUno,
              weight: POLYLINE_COLORS.strokeWeight,
            }).addTo(map);
            polylinesRef.current.push(polyline);
          }
        });
      });
    }

    // Render polylines from context state (directo from punto selection)
    if (polylines.ladoUno.length > 0) {
      const poly1 = L.polyline(polylines.ladoUno, {
        color: POLYLINE_COLORS.ladoUno,
        weight: POLYLINE_COLORS.strokeWeight,
      }).addTo(map);
      polylinesRef.current.push(poly1);
    }

    if (polylines.ladoDos.length > 0) {
      const poly2 = L.polyline(polylines.ladoDos, {
        color: POLYLINE_COLORS.ladoDos,
        weight: POLYLINE_COLORS.strokeWeight,
      }).addTo(map);
      polylinesRef.current.push(poly2);
    }
  }, [selectedRoute, mejorRutaResult, polylines]);

  // ── Render Circles ──────────────────────────────────────

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear circles (already done above, but keep for clarity)
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    // Punto 1 circle
    if (punto1) {
      const circle1 = L.circle([punto1.lat, punto1.lng], {
        color: CIRCLE_COLORS.punto1,
        fillColor: CIRCLE_COLORS.punto1,
        fillOpacity: CIRCLE_COLORS.opacity,
        radius: CIRCLE_COLORS.radius,
        weight: 1,
      }).addTo(map);
      circlesRef.current.push(circle1);
    }

    // Punto 2 circle
    if (punto2) {
      const circle2 = L.circle([punto2.lat, punto2.lng], {
        color: CIRCLE_COLORS.punto2,
        fillColor: CIRCLE_COLORS.punto2,
        fillOpacity: CIRCLE_COLORS.opacity,
        radius: CIRCLE_COLORS.radius,
        weight: 1,
      }).addTo(map);
      circlesRef.current.push(circle2);
    }

    // Cruce circle
    if (cruce) {
      const circleCruce = L.circle([cruce.lat, cruce.lng], {
        color: CIRCLE_COLORS.cruce,
        fillColor: CIRCLE_COLORS.cruce,
        fillOpacity: CIRCLE_COLORS.opacity,
        radius: CIRCLE_COLORS.radius,
        weight: 1,
      }).addTo(map);
      circlesRef.current.push(circleCruce);
    }
  }, [punto1, punto2, cruce]);

  // ── Fit bounds when polylines change ───────────────────

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || polylinesRef.current.length === 0) return;

    const group = L.featureGroup(polylinesRef.current);
    if (group.getBounds().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [polylines, selectedRoute, mejorRutaResult]);

  // ── Mode indicator (visual feedback for user) ───────────

  const modeLabel =
    mode === 'point-selection'
      ? 'Selecciona dos puntos'
      : mode === 'nearby-routes'
      ? 'Selecciona un punto'
      : '';

  return (
    <div className="relative w-full h-full z-0">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Mode indicator toast */}
      {modeLabel && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          {modeLabel}
        </div>
      )}
    </div>
  );
}