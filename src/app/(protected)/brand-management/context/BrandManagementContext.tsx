'use client';

import { useGlobalProtected } from '@/contexts';
import { createContext } from 'react';

import useBrandManagementContext from './useBrandManagementContext';

export const BrandManagementContext = createContext(
  {} as ReturnType<typeof useBrandManagementContext>,
);

export function BrandManagementProvider({ children }: { children: React.ReactNode }) {
  const { selectedPspId } = useGlobalProtected();
  const contextValue = useBrandManagementContext(selectedPspId);

  return (
    <BrandManagementContext.Provider value={contextValue}>
      {children}
    </BrandManagementContext.Provider>
  );
}
