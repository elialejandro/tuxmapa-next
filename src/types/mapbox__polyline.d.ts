// Type declarations for @mapbox/polyline
declare module '@mapbox/polyline' {
  /**
   * Decodes a Google-encoded polyline string into an array of [lat, lng] coordinate pairs.
   * @param encoded - The encoded polyline string
   * @returns Array of [latitude, longitude] tuples
   */
  export function decode(encoded: string): [number, number][];
}