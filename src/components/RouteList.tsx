'use client';

// ============================================================
// RouteList — Scrollable Route List Component
// ============================================================
// Reusable list component for displaying filtered routes.
// Used by Sidebar for the main route list.

import type { RutaListItem } from '@/types';

interface RouteListProps {
  rutas: RutaListItem[];
  onRouteSelect: (ruta: string) => void;
  selectedRoute: string | null;
  isLoading: boolean;
}

export default function RouteList({
  rutas,
  onRouteSelect,
  selectedRoute,
  isLoading,
}: RouteListProps) {
  return (
    <nav className="flex-1 overflow-y-auto max-h-[40vh] border-t border-slate-100">
      {isLoading ? (
        <div className="p-4 text-sm text-slate-500 text-center">
          Cargando rutas...
        </div>
      ) : rutas.length === 0 ? (
        <div className="p-4 text-sm text-slate-500 text-center">
          No se encontraron rutas
        </div>
      ) : (
        <ul className="py-1">
          {rutas.map((item) => {
            const routeNumber = item.ruta.replace('RUTA-', '');
            const isSelected = selectedRoute === item.ruta;

            return (
              <li key={item.ruta}>
                <button
                  onClick={() => onRouteSelect(item.ruta)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {/* Bus icon */}
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h8m-8 4h8m-4-8v16m-4 0h8m-10-4h2m4 0h2M4 6h16v10H4V6zm2 2v2h2V8H6z"
                    />
                  </svg>
                  <span>Ruta {routeNumber}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
