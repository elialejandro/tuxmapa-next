'use client';

// ============================================================
// Map Context — Shared State for Map Components
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  MapState,
  MapActions,
  LatLng,
  RutaDetailResponse,
  MejorRutaResultList,
  RutaCercanaItem,
  MapMode,
  MapPolylines,
} from '@/types';

// ============================================================
// Initial State
// ============================================================

const initialPolylines: MapPolylines = {
  ladoUno: [],
  ladoDos: [],
};

const initialMapState: MapState = {
  selectedRoute: null,
  punto1: null,
  punto2: null,
  cruce: null,
  mejorRutaResult: null,
  nearbyRoutes: [],
  mode: 'idle',
  polylines: initialPolylines,
};

// ============================================================
// Context Types
// ============================================================

interface MapContextValue extends MapState, MapActions {}

const MapContext = createContext<MapContextValue | null>(null);

// ============================================================
// Provider Component
// ============================================================

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MapState>(initialMapState);

  // ── Actions ──────────────────────────────────────────────

  const setSelectedRoute = useCallback((route: RutaDetailResponse | null) => {
    setState((prev) => ({ ...prev, selectedRoute: route }));
  }, []);

  const setPunto1 = useCallback((point: LatLng | null) => {
    setState((prev) => ({ ...prev, punto1: point }));
  }, []);

  const setPunto2 = useCallback((point: LatLng | null) => {
    setState((prev) => ({ ...prev, punto2: point }));
  }, []);

  const setCruce = useCallback((point: LatLng | null) => {
    setState((prev) => ({ ...prev, cruce: point }));
  }, []);

  const setMejorRutaResult = useCallback((result: MejorRutaResultList | null) => {
    setState((prev) => ({ ...prev, mejorRutaResult: result }));
  }, []);

  const setNearbyRoutes = useCallback((routes: RutaCercanaItem[]) => {
    setState((prev) => ({ ...prev, nearbyRoutes: routes }));
  }, []);

  const setMode = useCallback((mode: MapMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setPolylines = useCallback((polylines: MapPolylines) => {
    setState((prev) => ({ ...prev, polylines }));
  }, []);

  const clearMap = useCallback(() => {
    setState(initialMapState);
  }, []);

  // ── Provider Value ───────────────────────────────────────

  const value: MapContextValue = {
    ...state,
    setSelectedRoute,
    setPunto1,
    setPunto2,
    setCruce,
    setMejorRutaResult,
    setNearbyRoutes,
    setMode,
    setPolylines,
    clearMap,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

// ============================================================
// Hook
// ============================================================

export function useMapContext(): MapContextValue {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}