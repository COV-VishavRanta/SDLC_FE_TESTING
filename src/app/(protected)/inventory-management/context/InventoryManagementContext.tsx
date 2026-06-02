'use client';

import { useGlobalProtected } from '@/contexts';
import { createContext } from 'react';

import useInventoryManagementContext from './useInventoryManagementContext';

export const InventoryManagementContext = createContext(
  {} as ReturnType<typeof useInventoryManagementContext>,
);

export function InventoryManagementProvider({ children }: { children: React.ReactNode }) {
  const { selectedPspId } = useGlobalProtected();
  const contextValue = useInventoryManagementContext(selectedPspId);

  return (
    <InventoryManagementContext.Provider value={contextValue}>
      {children}
    </InventoryManagementContext.Provider>
  );
}
