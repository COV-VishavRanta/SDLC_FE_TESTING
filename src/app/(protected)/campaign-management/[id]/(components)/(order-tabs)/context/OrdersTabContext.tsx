'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrdersTabContextValue {
  /** Returns the saved files for a given order item, or an empty array if none. */
  getImages: (orderItemId: string) => File[];
  /** Saves files for a given order item. Clears invalid state for that item if files are provided. */
  setImages: (orderItemId: string, files: File[]) => void;
  /** Marks the given order item IDs as invalid (missing images — red border). */
  markInvalid: (orderItemIds: string[]) => void;
  /** Returns true if the given order item is marked as invalid. */
  isInvalid: (orderItemId: string) => boolean;
  /** Clears the invalid state for a given order item. */
  clearInvalid: (orderItemId: string) => void;
  /** Returns the saved notes for a given order item, or an empty string if none. */
  getNote: (orderItemId: string) => string;
  /** Saves notes for a given order item. */
  setNote: (orderItemId: string, note: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const OrdersTabContext = createContext<OrdersTabContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface OrdersTabProviderProps {
  children: React.ReactNode;
}

export function OrdersTabProvider({ children }: OrdersTabProviderProps) {
  const [imagesMap, setImagesMap] = useState<Record<string, File[]>>({});
  const [invalidItems, setInvalidItems] = useState<Set<string>>(new Set());
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const getImages = useCallback(
    (orderItemId: string): File[] => imagesMap[orderItemId] ?? [],
    [imagesMap],
  );

  const setImages = useCallback((orderItemId: string, files: File[]) => {
    setImagesMap((prev) => ({ ...prev, [orderItemId]: files }));
    if (files.length > 0) {
      setInvalidItems((prev) => {
        if (!prev.has(orderItemId)) return prev;
        const next = new Set(prev);
        next.delete(orderItemId);
        return next;
      });
    }
  }, []);

  const markInvalid = useCallback((orderItemIds: string[]) => {
    setInvalidItems((prev) => {
      const next = new Set(prev);
      orderItemIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const isInvalid = useCallback(
    (orderItemId: string) => invalidItems.has(orderItemId),
    [invalidItems],
  );

  const clearInvalid = useCallback((orderItemId: string) => {
    setInvalidItems((prev) => {
      if (!prev.has(orderItemId)) return prev;
      const next = new Set(prev);
      next.delete(orderItemId);
      return next;
    });
  }, []);

  const getNote = useCallback(
    (orderItemId: string): string => notesMap[orderItemId] ?? '',
    [notesMap],
  );

  const setNote = useCallback((orderItemId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [orderItemId]: note }));
  }, []);

  const value = useMemo<OrdersTabContextValue>(
    () => ({ getImages, setImages, markInvalid, isInvalid, clearInvalid, getNote, setNote }),
    [getImages, setImages, markInvalid, isInvalid, clearInvalid, getNote, setNote],
  );

  return <OrdersTabContext.Provider value={value}>{children}</OrdersTabContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrdersTab(): OrdersTabContextValue {
  const ctx = useContext(OrdersTabContext);
  if (!ctx) {
    throw new Error('useOrdersTab must be used within <OrdersTabProvider>');
  }
  return ctx;
}
