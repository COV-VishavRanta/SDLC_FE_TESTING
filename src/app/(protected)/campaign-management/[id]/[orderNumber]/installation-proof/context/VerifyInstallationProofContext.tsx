'use client';

import {
  GET_CAMPAIGN,
  GET_CAMPAIGN_STORE_ORDER,
  GetCampaignResponse,
  GetCampaignStoreOrderResponse,
  GetCampaignStoreOrderVariables,
  GetCampaignVariables,
} from '@/graphql';
import { StoreOrderType } from '@/types';
import { useSuspenseQuery } from '@apollo/client/react';
import { createContext, PropsWithChildren } from 'react';

/* ─── Types ─── */
export interface VerifyInstallationProofContextValue {
  campaignId: string;
  orderNumber: number;
  encodedCampaignId: string;
  storeOrder: StoreOrderType | undefined;
  campaignName: string;
  storeId: string;
}

export interface VerifyInstallationProofProviderProps extends PropsWithChildren {
  campaignId: string;
  orderNumber: number;
  encodedCampaignId: string;
}

/* ─── Context ─── */
export const VerifyInstallationProofContext = createContext<VerifyInstallationProofContextValue>({
  campaignId: '',
  orderNumber: 0,
  encodedCampaignId: '',
  storeOrder: undefined,
  campaignName: '',
  storeId: '',
});

/* ─── Provider ─── */
export function VerifyInstallationProofProvider({
  children,
  campaignId,
  orderNumber,
  encodedCampaignId,
}: VerifyInstallationProofProviderProps) {
  const { data: campaignData } = useSuspenseQuery<GetCampaignResponse, GetCampaignVariables>(
    GET_CAMPAIGN,
    { variables: { campaignId } },
  );

  const { data: storeOrdersData } = useSuspenseQuery<
    GetCampaignStoreOrderResponse,
    GetCampaignStoreOrderVariables
  >(GET_CAMPAIGN_STORE_ORDER, {
    variables: { campaignId, orderNumber },
  });

  const campaignName = campaignData?.campaign?.campaign?.name ?? '';

  const storeOrder = storeOrdersData?.campaignStoreOrder?.storeOrder;

  const storeId = storeOrder?.storeId ?? '';

  return (
    <VerifyInstallationProofContext.Provider
      value={{ campaignId, orderNumber, encodedCampaignId, storeOrder, campaignName, storeId }}
    >
      {children}
    </VerifyInstallationProofContext.Provider>
  );
}
