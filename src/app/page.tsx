'use client';

// ============================================================
// Main Map Page — TuXmapa Home
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMapContext } from '@/context/MapContext';
import { getRutas, getRuta, getMejorRuta, getRutasCercanas } from '@/lib/api';
import type { LatLng, RutaListItem } from '@/types';
import Toolbar from '@/components/Toolbar';
import Sidebar from '@/components/Sidebar';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic import for MapView (Leaflet requires window, so no SSR)
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <LoadingScreen message="Cargando mapa..." />,
});

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rutas, setRutas] = useState<RutaListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    selectedRoute,
    setSelectedRoute,
    setPunto1,
    setPunto2,
    setMode,
    clearMap,
    mode,
    setMejorRutaResult,
    setNearbyRoutes,
    punto1,
  } = useMapContext();

  // ── Fetch rutas on mount ─────────────────────────────────

  useEffect(() => {
    async function fetchRutas() {
      try {
        const response = await getRutas();
        setRutas(response.list);
      } catch (error) {
        console.error('Error fetching rutas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRutas();
  }, []);

  // ── Route selection ────────────────────────────────────

  const handleRouteSelect = useCallback(
    async (rutaNombre: string) => {
      try {
        const rutaDetail = await getRuta(rutaNombre);
        setSelectedRoute(rutaDetail);
        setMode('idle');
      } catch (error) {
        console.error('Error fetching ruta detail:', error);
      }
    },
    [setSelectedRoute, setMode]
  );

  // ── Point selection mode ───────────────────────────────

  const handlePointSelectionMode = useCallback(() => {
    setPunto1(null);
    setPunto2(null);
    setMejorRutaResult(null);
    setMode('point-selection');
  }, [setPunto1, setPunto2, setMejorRutaResult, setMode]);

  // ── Nearby routes mode ─────────────────────────────────

  const handleNearbyRoutesMode = useCallback(() => {
    setPunto1(null);
    setPunto2(null);
    setMejorRutaResult(null);
    setNearbyRoutes([]);
    setMode('nearby-routes');
  }, [setPunto1, setPunto2, setMejorRutaResult, setNearbyRoutes, setMode]);

  // ── Clear map ──────────────────────────────────────────

  const handleClearMap = useCallback(() => {
    clearMap();
  }, [clearMap]);

  // ── Map click handler ──────────────────────────────────

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      const clickedPoint: LatLng = { lat, lng };

      if (mode === 'point-selection') {
        if (!punto1) {
          // First click - set punto1
          setPunto1(clickedPoint);
        } else {
          // Second click - set punto2 and get mejor ruta
          setPunto2(clickedPoint);
          try {
            const result = await getMejorRuta(punto1, clickedPoint);
            setMejorRutaResult(result); // Store the full array
            setMode('idle');
          } catch (error) {
            console.error('Error fetching mejor ruta:', error);
            setMode('idle');
          }
        }
      } else if (mode === 'nearby-routes') {
        // Single click - get nearby routes
        try {
          const nearby = await getRutasCercanas(clickedPoint);
          setNearbyRoutes(nearby);
        } catch (error) {
          console.error('Error fetching nearby routes:', error);
        }
      }
    },
    [mode, punto1, setPunto1, setPunto2, setMejorRutaResult, setMode, setNearbyRoutes]
  );

  return (
    <div className="flex h-full">
      {/* Sidebar — pushes content on desktop, overlay on mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        rutas={rutas}
        onRouteSelect={handleRouteSelect}
        selectedRoute={selectedRoute?.ruta ?? null}
        onPointSelectionMode={handlePointSelectionMode}
        onNearbyRoutesMode={handleNearbyRoutesMode}
        onClearMap={handleClearMap}
        isLoading={isLoading}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Toolbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 relative">
          <MapView onMapClick={handleMapClick} />

          {/* FAB to open sidebar — hidden on desktop (sidebar always visible) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menú de rutas"
            className="absolute bottom-6 right-6 z-[1001] w-14 h-14 bg-[#0c72b5] hover:bg-[#0a5f96] text-white rounded-full shadow-lg flex items-center justify-center transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Error toast when API fails */}
          {isLoading && rutas.length === 0 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              ⚠️ No se pudieron cargar las rutas. Verifica la conexión con la API.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}