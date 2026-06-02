'use client';

import { createContext, useContext } from 'react';

import useReorderDetailsContext from './useReorderDetailsContext';

export const ReorderDetailsContext = createContext(
  {} as ReturnType<typeof useReorderDetailsContext>,
);

export function ReorderDetailsProvider({
  reorderId,
  children,
}: {
  reorderId: string;
  children: React.ReactNode;
}) {
  const contextValue = useReorderDetailsContext(reorderId);

  return (
    <ReorderDetailsContext.Provider value={contextValue}>{children}</ReorderDetailsContext.Provider>
  );
}

export function useReorderDetails() {
  return useContext(ReorderDetailsContext);
}
