'use client';

// ============================================================
// Toast — Ephemeral notification messages
// ============================================================
// Auto-dismisses after duration. Used for map interaction feedback.

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'info' | 'success' | 'error';
}

export default function Toast({ message, duration = 3000, type = 'info' }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = {
    info: 'bg-slate-800',
    success: 'bg-green-600',
    error: 'bg-red-600',
  }[type];

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in`}>
      {message}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}