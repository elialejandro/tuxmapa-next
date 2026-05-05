// ============================================================
// API Client for Tuxmapa Backend
// ============================================================

import type {
  LatLng,
  RutaListResponse,
  RutaDetailResponse,
  MejorRutaResponse,
  MejorRutaResultList,
  RutaCercanaItem,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tuxmapa.com.mx/v2';

// ============================================================
// Fetch Wrapper with Error Handling
// ============================================================

async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    // Include credentials for potential cookies/sessions
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} — ${url}`);
  }

  return response.json() as Promise<T>;
}

// ============================================================
// API Endpoints
// ============================================================

/**
 * GET /rutas
 * Returns list of all available routes
 * Response: { count: number, list: [{ruta: string}], code: number }
 */
export async function getRutas(): Promise<RutaListResponse> {
  return apiFetch<RutaListResponse>(`${API_BASE_URL}/rutas`);
}

/**
 * GET /ruta/{nombre}
 * Returns route detail with encoded polylines for both sides
 * Response: { ruta: string, puntos: { lado_uno, lado_dos }, lados?: string[] }
 */
export async function getRuta(nombre: string): Promise<RutaDetailResponse> {
  return apiFetch<RutaDetailResponse>(`${API_BASE_URL}/ruta/${nombre}`);
}

/**
 * GET /mejor_ruta?lat1=&lng1=&lat2=&lng2=
 * Returns the best route between two points
 * Response: Array of { rutas: [{nombre, puntos}], cruce: {lat, lng} }
 */
export async function getMejorRuta(
  puntoUno: LatLng,
  puntoDos: LatLng
): Promise<MejorRutaResultList> {
  const params = new URLSearchParams({
    lat1: puntoUno.lat.toString(),
    lng1: puntoUno.lng.toString(),
    lat2: puntoDos.lat.toString(),
    lng2: puntoDos.lng.toString(),
  });

  return apiFetch<MejorRutaResultList>(`${API_BASE_URL}/mejor_ruta?${params.toString()}`);
}

/**
 * GET /rutas_cercanas?lat=&lng=
 * Returns routes near a given point
 * Response: Array of { nombre, lado_uno, lado_dos }
 */
export async function getRutasCercanas(latLng: LatLng): Promise<RutaCercanaItem[]> {
  const params = new URLSearchParams({
    lat: latLng.lat.toString(),
    lng: latLng.lng.toString(),
  });

  return apiFetch<RutaCercanaItem[]>(`${API_BASE_URL}/rutas_cercanas?${params.toString()}`);
}

// ============================================================
// Type Exports (re-exported for convenience)
// ============================================================

export type { LatLng, RutaListResponse, RutaDetailResponse, MejorRutaResponse, MejorRutaResultList, RutaCercanaItem };