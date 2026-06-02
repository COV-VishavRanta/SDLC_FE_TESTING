'use client';

import { createContext } from 'react';

import useReportsContext from './useReportsContext';

export const ReportsContext = createContext<ReturnType<typeof useReportsContext>>(
  {} as ReturnType<typeof useReportsContext>,
);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useReportsContext();

  return <ReportsContext.Provider value={contextValue}>{children}</ReportsContext.Provider>;
}
