'use client';

import { CampaignGuard } from '@/components';
import { createContext } from 'react';
import useImportPromotionsContext from './useImportPromotionsContext';

export interface ImportPromotionsProviderProps {
  children: React.ReactNode;
  encodedCampaignId: string;
}
export const ImportPromotionsContext = createContext(
  {} as ReturnType<typeof useImportPromotionsContext>,
);

export function ImportPromotionsProvider({
  children,
  encodedCampaignId,
}: ImportPromotionsProviderProps) {
  const contextValue = useImportPromotionsContext({ encodedCampaignId });

  return (
    <CampaignGuard status={contextValue.destinationCampaign?.status}>
      <ImportPromotionsContext.Provider value={contextValue}>
        {children}
      </ImportPromotionsContext.Provider>
    </CampaignGuard>
  );
}
