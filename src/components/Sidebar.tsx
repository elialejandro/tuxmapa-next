'use client';

// ============================================================
// Sidebar — Navigation Drawer with Route List
// ============================================================
// Slides in from left, contains:
// - Search input for filtering routes
// - Scrollable route list (filtered by search)
// - Navigation buttons: Rutas por puntos, Rutas cercanas, Limpiar mapa
// - Links: Términos y condiciones
// - Footer: link to "Nosotros" (external corporate site)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { RutaListItem } from '@/types';
import RouteSearch from './RouteSearch';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rutas: RutaListItem[];
  onRouteSelect: (ruta: string) => void;
  selectedRoute: string | null;
  onPointSelectionMode: () => void;
  onNearbyRoutesMode: () => void;
  onClearMap: () => void;
  isLoading?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  rutas,
  onRouteSelect,
  selectedRoute,
  onPointSelectionMode,
  onNearbyRoutesMode,
  onClearMap,
  isLoading = false,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rutas based on search term (case-insensitive)
  const filteredRutas = rutas.filter((item) =>
    item.ruta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset search when sidebar closes
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  const translateClass = isOpen ? 'translate-x-0' : '-translate-x-full';
  const desktopVisible = isOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full';

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          bg-white shadow-xl z-[1002] transition-all duration-200 ease-out
          ${translateClass} ${desktopVisible}
          /* Mobile: fixed overlay */
          fixed left-0 top-0 h-full w-72
          /* Desktop: fixed to left, below toolbar */
          lg:fixed lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:w-72 lg:shadow-none lg:border-r lg:border-slate-200
        `}
        aria-label="Navegación"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            Transporte Público
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <RouteSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar ruta..."
        />

        {/* Route List */}
        <nav className="flex-1 overflow-y-auto max-h-[40vh] border-t border-slate-100">
          {isLoading ? (
            <div className="p-4 text-sm text-slate-500 text-center">
              Cargando rutas...
            </div>
          ) : filteredRutas.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">
              {searchTerm ? 'No se encontraron rutas' : 'Sin rutas disponibles'}
            </div>
          ) : (
            <ul className="py-1">
              {filteredRutas.map((item) => {
                const routeNumber = item.ruta.replace('RUTA-', '');
                const isSelected = selectedRoute === item.ruta;

                return (
                  <li key={item.ruta}>
                    <button
                      onClick={() => {
                        onRouteSelect(item.ruta);
                        onClose();
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'bg-[#0c72b5]/10 text-[#0c72b5] font-medium'
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

        {/* Action Buttons */}
        <div className="border-t border-slate-200 px-3 py-3 space-y-1">
          <button
            onClick={() => {
              onPointSelectionMode();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-3 transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Rutas por puntos
          </button>

          <button
            onClick={() => {
              onNearbyRoutesMode();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-3 transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-500"
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
            Rutas cercanas al punto
          </button>

          <button
            onClick={() => {
              onClearMap();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-3 transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Limpiar Mapa
          </button>
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 px-3 py-3">
          <Link
            href="/terminos"
            className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            onClick={onClose}
          >
            Términos y condiciones de uso
          </Link>
          <a
            href="https://corporativo.tuxmapa.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
          >
            Nosotros
          </a>
        </div>
      </aside>
    </>
  );
}