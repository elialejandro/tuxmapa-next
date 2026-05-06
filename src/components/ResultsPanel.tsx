'use client';

// ============================================================
// ResultsPanel — Collapsible Results Panel
// ============================================================
// Shows found routes from "mejor_ruta" or "rutas_cercanas" queries.
// Each route combination (pair) is clickable and shows its specific routes + cruce.

import { useState } from 'react';
import { useMapState } from '@/hooks/useMapState';
import { decodePolyline } from '@/lib/polyline';
import { getRuta } from '@/lib/api';
import type { MejorRutaResponse } from '@/types';

export default function ResultsPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    mejorRutaResult,
    nearbyRoutes,
    setPolylines,
    setCruce,
    setSelectedRoute,
  } = useMapState();

  const hasResults = (mejorRutaResult?.length ?? 0) > 0 || nearbyRoutes.length > 0;

  // Handle click on a mejor_ruta result (a pair of routes with their cruce)
  function handleResultClick(result: MejorRutaResponse) {
    // Decode both routes at once (avoid stale state issues)
    const decoded0 = result.rutas[0] ? decodePolyline(result.rutas[0].puntos) : [];
    const decoded1 = result.rutas[1] ? decodePolyline(result.rutas[1].puntos) : [];

    // Set both polylines in a single update
    setPolylines({
      ladoUno: decoded0,
      ladoDos: decoded1,
    });

    // Set the specific cruce for this result pair
    if (result.cruce) {
      setCruce(result.cruce);
    }
  }

  // Handle click on a nearby route
  async function handleNearbyRouteClick(nombre: string) {
    try {
      const rutaDetail = await getRuta(nombre);
      setSelectedRoute(rutaDetail);
    } catch (error) {
      console.error('Error fetching route detail:', error);
    }
  }

  if (!hasResults) return null;

  // Count routes from mejor_ruta (each result has 2 routes: [routeA, routeB])
  const mejorRutaCount = mejorRutaResult?.length ?? 0;
  const nearbyCount = nearbyRoutes.length;
  const resultCount = mejorRutaCount + nearbyCount;

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
      {/* Header with toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-700">
          Rutas encontradas ({resultCount})
        </span>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="max-h-80 overflow-y-auto">
          {/* Mejor ruta results — show ALL results, each with 2 routes */}
          {mejorRutaResult && mejorRutaResult.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide bg-slate-50">
                Rutas con intersección ({mejorRutaResult.length})
              </div>
              <ul className="py-1">
                {mejorRutaResult.map((result, idx) => {
                  const hasIntersection = result.cruce && result.rutas.length > 1;
                  const route1Name = result.rutas[0]?.nombre?.replace('RUTA-', 'Ruta ') ?? '';
                  const route2Name = result.rutas[1]?.nombre?.replace('RUTA-', 'Ruta ') ?? '';

                  return (
                    <li key={`result-${idx}`}>
                      <button
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#0c72b5]/10 hover:text-[#0c72b5] transition-colors flex items-center gap-2"
                      >
                        {/* Intersection icon */}
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${hasIntersection ? 'text-blue-600' : 'text-green-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {hasIntersection ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          )}
                        </svg>
                        <span className="flex flex-wrap gap-1">
                          {/* Route 1 */}
                          <span className="font-medium text-slate-800">{route1Name}</span>
                          {/* Arrow and route 2 if exists */}
                          {hasIntersection && (
                            <>
                              <span className="text-slate-400">↔</span>
                              <span className="font-medium text-slate-800">{route2Name}</span>
                              <span className="text-xs text-blue-500 font-medium ml-1">(cruce)</span>
                            </>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Nearby routes results */}
          {nearbyRoutes.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide bg-slate-50">
                Rutas cercanas ({nearbyRoutes.length})
              </div>
              <ul className="py-1">
                {nearbyRoutes.map((ruta, index) => (
                  <li key={`nearby-${ruta.nombre}-${index}`}>
                    <button
                      onClick={() => handleNearbyRouteClick(ruta.nombre)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#0c72b5]/10 hover:text-[#0c72b5] transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-purple-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{ruta.nombre.replace('RUTA-', 'Ruta ')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}