'use client';

// ============================================================
// RouteSearch — Search Input with Debounced Filtering
// ============================================================
// Filters the route list as the user types.
// Case-insensitive match on route number.

import { useState, useEffect } from 'react';

interface RouteSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RouteSearch({
  value,
  onChange,
  placeholder = 'Buscar ruta...',
}: RouteSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  // Debounce to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  return (
    <div className="px-3 py-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}