'use client';

import { createContext } from 'react';

import useStoreManagementContext from './useStoreManagementContext';

export const StoreManagementContext = createContext(
  {} as ReturnType<typeof useStoreManagementContext>,
);

export interface StoreManagementProviderProps {
  children: React.ReactNode;
}

export function StoreManagementProvider({ children }: StoreManagementProviderProps) {
  const contextValue = useStoreManagementContext();
  return (
    <StoreManagementContext.Provider value={contextValue}>
      {children}
    </StoreManagementContext.Provider>
  );
}
