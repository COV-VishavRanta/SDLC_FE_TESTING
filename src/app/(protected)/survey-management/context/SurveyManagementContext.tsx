'use client';

import { createContext } from 'react';

import useSurveyManagementContext from './useSurveyManagementContext';

export const SurveyManagementContext = createContext(
  {} as ReturnType<typeof useSurveyManagementContext>,
);

export function SurveyManagementProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useSurveyManagementContext();

  return (
    <SurveyManagementContext.Provider value={contextValue}>
      {children}
    </SurveyManagementContext.Provider>
  );
}
