// ============================================================
// Core Types for Tuxmapa
// ============================================================

export interface LatLng {
  lat: number;
  lng: number;
}

// ============================================================
// API Response Types
// ============================================================

export interface RutaListItem {
  ruta: string;
}

export interface RutaListResponse {
  count: number;
  list: RutaListItem[];
  code: number;
}

export interface RutaPuntos {
  lado_uno: string;
  lado_dos: string;
}

export interface RutaDetailResponse {
  ruta: string;
  puntos: RutaPuntos;
  lados?: string[]; // e.g., ["1-vuelta", "1-ida"]
}

export interface RutaRoute {
  nombre: string;
  puntos: string;
}

export interface MejorRutaResponse {
  rutas: RutaRoute[];
  cruce: LatLng;
}

export type MejorRutaResultList = MejorRutaResponse[];

export interface RutaCercanaItem {
  nombre: string;
  lado_uno: string;
  lado_dos: string;
}

// ============================================================
// Map State Types
// ============================================================

export type MapMode = 'idle' | 'point-selection' | 'nearby-routes';

export interface MapPolylines {
  ladoUno: [number, number][]; // [lat, lng][]
  ladoDos: [number, number][];
}

export interface MapState {
  selectedRoute: RutaDetailResponse | null;
  punto1: LatLng | null;
  punto2: LatLng | null;
  cruce: LatLng | null;
  mejorRutaResult: MejorRutaResultList | null;
  nearbyRoutes: RutaCercanaItem[];
  mode: MapMode;
  polylines: MapPolylines;
}

export interface MapActions {
  setSelectedRoute: (route: RutaDetailResponse | null) => void;
  setPunto1: (point: LatLng | null) => void;
  setPunto2: (point: LatLng | null) => void;
  setCruce: (point: LatLng | null) => void;
  setMejorRutaResult: (result: MejorRutaResultList | null) => void;
  setNearbyRoutes: (routes: RutaCercanaItem[]) => void;
  setMode: (mode: MapMode) => void;
  setPolylines: (polylines: MapPolylines) => void;
  clearMap: () => void;
}

// ============================================================
// Component Props Types
// ============================================================

export interface RouteListItemProps {
  ruta: string;
  onClick: (ruta: string) => void;
  isSelected: boolean;
}

export interface PointMarkerProps {
  point: LatLng;
  color: string;
  radius?: number;
}