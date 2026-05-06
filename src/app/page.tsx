'use client';

// ============================================================
// Main Map Page — TuXmapa Home
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMapContext } from '@/context/MapContext';
import { getRutas, getRuta, getMejorRuta, getRutasCercanas } from '@/lib/api';
import type { LatLng, RutaListItem } from '@/types';
import Toolbar from '@/components/Toolbar';
import Sidebar from '@/components/Sidebar';
import LoadingScreen from '@/components/LoadingScreen';
import Toast from '@/components/Toast';

// Dynamic import for MapView (Leaflet requires window, so no SSR)
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <LoadingScreen message="Cargando mapa..." />,
});

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rutas, setRutas] = useState<RutaListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

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
    punto2,
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
    setToast({ message: 'Esperando el primer punto.', type: 'info' });
  }, [setPunto1, setPunto2, setMejorRutaResult, setMode]);

  // ── Nearby routes mode ─────────────────────────────────

  const handleNearbyRoutesMode = useCallback(() => {
    setPunto1(null);
    setPunto2(null);
    setMejorRutaResult(null);
    setNearbyRoutes([]);
    setMode('nearby-routes');
    setToast({ message: 'Buscando rutas cercanas...', type: 'info' });
  }, [setPunto1, setPunto2, setMejorRutaResult, setNearbyRoutes, setMode]);

  // ── Clear map ──────────────────────────────────────────

  const handleClearMap = useCallback(() => {
    clearMap();
    setToast({ message: 'Mapa limpiado.', type: 'info' });
  }, [clearMap]);

  // ── Map click handler ──────────────────────────────────
  // Use refs to always call the LATEST version of context state and setters
  // This avoids stale closures in useCallback

  const setPunto1Ref = useRef(setPunto1);
  const setPunto2Ref = useRef(setPunto2);
  const setMejorRutaResultRef = useRef(setMejorRutaResult);
  const setModeRef = useRef(setMode);
  const setNearbyRoutesRef = useRef(setNearbyRoutes);
  const setToastRef = useRef(setToast);
  const modeRef = useRef(mode);
  const punto1Ref = useRef(punto1);

  // Keep refs updated whenever state or setters change
  useEffect(() => {
    setPunto1Ref.current = setPunto1;
    setPunto2Ref.current = setPunto2;
    setMejorRutaResultRef.current = setMejorRutaResult;
    setModeRef.current = setMode;
    setNearbyRoutesRef.current = setNearbyRoutes;
    setToastRef.current = setToast;
    modeRef.current = mode;
    punto1Ref.current = punto1;
  }, [setPunto1, setPunto2, setMejorRutaResult, setMode, setNearbyRoutes, setToast, mode, punto1]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      console.log('[TUXMAPA] handleMapClick', { lat, lng, mode: modeRef.current, punto1: punto1Ref.current });
      const clickedPoint: LatLng = { lat, lng };

      if (modeRef.current === 'point-selection') {
        if (!punto1Ref.current) {
          // First click - set punto1
          console.log('[TUXMAPA] Setting punto1:', clickedPoint);
          setPunto1Ref.current(clickedPoint);
          setToastRef.current({ message: 'Esperando el segundo punto.', type: 'info' });
        } else {
          // Second click - set punto2 and get mejor ruta
          console.log('[TUXMAPA] Setting punto2:', clickedPoint);
          setPunto2Ref.current(clickedPoint);
          setToastRef.current({ message: 'Calculando rutas...', type: 'info' });
          try {
            const result = await getMejorRuta(punto1Ref.current, clickedPoint);
            setMejorRutaResultRef.current(result);
            setModeRef.current('idle');
            setToastRef.current({ message: 'Rutas encontradas.', type: 'success' });
          } catch (error) {
            console.error('Error fetching mejor ruta:', error);
            setModeRef.current('idle');
            setToastRef.current({ message: 'No se encontraron rutas.', type: 'error' });
          }
        }
      } else if (modeRef.current === 'nearby-routes') {
        console.log('[TUXMAPA] nearby-routes mode, searching');
        try {
          const nearby = await getRutasCercanas(clickedPoint);
          setNearbyRoutesRef.current(nearby);
          setToastRef.current({ message: `${nearby.length} rutas encontradas.`, type: 'success' });
        } catch (error) {
          console.error('Error fetching nearby routes:', error);
          setToastRef.current({ message: 'No se encontraron rutas.', type: 'error' });
        }
      }
    },
    [] // No deps - we use refs to access fresh state
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

          {/* Point selection feedback toasts */}
          {toast && (
            <Toast message={toast.message} type={toast.type} />
          )}
        </main>
      </div>
    </div>
  );
}