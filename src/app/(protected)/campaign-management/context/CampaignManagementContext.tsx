'use client';

import { createContext } from 'react';

import useCampaignManagementContext from './useCampaignManagementContext';

export interface CampaignManagementProviderProps {
  children: React.ReactNode;
  initialStatus?: string;
}
export const CampaignManagementContext = createContext(
  {} as ReturnType<typeof useCampaignManagementContext>,
);

export function CampaignManagementProvider({
  children,
  initialStatus,
}: CampaignManagementProviderProps) {
  const contextValue = useCampaignManagementContext({ initialStatus });

  return (
    <CampaignManagementContext.Provider value={contextValue}>
      {children}
    </CampaignManagementContext.Provider>
  );
}
