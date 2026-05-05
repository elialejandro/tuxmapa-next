'use client';

// ============================================================
// LoadingScreen — Full-screen loader with logo animation
// Auto-dismisses after minimumDuration milliseconds.
// ============================================================

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  minimumDuration?: number; // milliseconds, default 1500
}

export default function LoadingScreen({
  message = 'Cargando...',
  minimumDuration = 1500,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [minimumDuration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* Logo with pulse animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#0c72b5] rounded-full opacity-20 animate-ping" />
        <div className="relative">
          <Image
            src="/tuxmapa_logo.png"
            alt="Tuxmapa Logo"
            width={100}
            height={100}
            className="w-24 h-24 object-contain"
            priority
          />
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-8 text-[#0c72b5] text-lg font-medium animate-pulse">
        {message}
      </p>

      {/* Progress bar */}
      <div className="mt-6 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#0c72b5] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}