'use client';

// ============================================================
// Toolbar — Top Navigation Bar
// ============================================================
// Provides hamburger menu for sidebar toggle and app title.
// Back button appears on subpages (/nosotros, /terminos).

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ToolbarProps {
  onMenuClick?: () => void;
  showBackButton?: boolean;
  title?: string;
}

export default function Toolbar({
  onMenuClick,
  showBackButton = false,
  title = 'Tuxmapa',
}: ToolbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="flex items-center gap-3 px-4 h-14 bg-slate-800 text-white shadow-md z-50">
      {/* Menu button (hamburger) — only on home page */}
      {isHomePage ? (
        <button
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="p-2 hover:bg-slate-700 rounded-md transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      ) : (
        <Link
          href="/"
          aria-label="Volver al mapa"
          className="p-2 hover:bg-slate-700 rounded-md transition-colors"
        >
          <svg
            className="w-6 h-6"
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
        </Link>
      )}

      {/* Title */}
      <span className="text-lg font-semibold tracking-tight">{title}</span>
    </header>
  );
}