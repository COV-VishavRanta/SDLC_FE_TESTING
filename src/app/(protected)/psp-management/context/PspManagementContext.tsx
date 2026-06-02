'use client';

import { createContext } from 'react';

import usePspManagementContext from './usePspManagementContext';

export const PspManagementContext = createContext({} as ReturnType<typeof usePspManagementContext>);

export interface PspManagementProviderProps {
  children: React.ReactNode;
}

export function PspManagementProvider({ children }: PspManagementProviderProps) {
  const contextValue = usePspManagementContext();
  return (
    <PspManagementContext.Provider value={contextValue}>{children}</PspManagementContext.Provider>
  );
}
