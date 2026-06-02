'use client';

import { createContext } from 'react';

import useCampaignDetailsContext from './useCampaignDetailsContext';

export const CampaignDetailsContext = createContext(
  {} as ReturnType<typeof useCampaignDetailsContext>,
);

export interface CampaignDetailsProviderProps {
  children: React.ReactNode;
  campaignId: string;
  encodedCampaignId: string;
}

export function CampaignDetailsProvider({
  children,
  campaignId,
  encodedCampaignId,
}: CampaignDetailsProviderProps) {
  const contextValue = useCampaignDetailsContext({ encodedCampaignId, campaignId });

  return (
    <CampaignDetailsContext.Provider value={contextValue}>
      {children}
    </CampaignDetailsContext.Provider>
  );
}
