// ============================================================
// Polyline Decoding Utility
// ============================================================

import { decode } from '@mapbox/polyline';

/**
 * Decode a Google-encoded polyline string to an array of [lat, lng] tuples.
 * Used for converting encoded route polylines from the API.
 */
export function decodePolyline(encoded: string): [number, number][] {
  if (!encoded || typeof encoded !== 'string') {
    return [];
  }

  const decoded = decode(encoded);

  // @mapbox/polyline returns [lat, lng][] — we keep that format for Leaflet compatibility
  return decoded as [number, number][];
}

/**
 * Decode both sides of a route (lado_uno and lado_dos) at once.
 */
export function decodeRoutePolylines(
  ladoUno: string,
  ladoDos: string
): { ladoUno: [number, number][]; ladoDos: [number, number][] } {
  return {
    ladoUno: decodePolyline(ladoUno),
    ladoDos: decodePolyline(ladoDos),
  };
}

// ============================================================
// Polyline Colors (from original Angular app)
// ============================================================

export const POLYLINE_COLORS = {
  ladoUno: '#2E8B57',  // sea green
  ladoDos: '#9400D3',  // dark violet
  strokeWeight: 4,
} as const;

export const CIRCLE_COLORS = {
  punto1: '#3dc706',   // lime green
  punto2: '#0142fc',   // blue
  cruce: '#0084b4',    // teal
  radius: 300,         // meters
  opacity: 0.6,
} as const;