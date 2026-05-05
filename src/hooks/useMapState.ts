'use client';

// ============================================================
// useMapState — Custom Hook for Map State Management
// ============================================================

// Re-export the hook from MapContext for convenience
// Components import this instead of directly from MapContext
export { useMapContext as useMapState } from '@/context/MapContext';