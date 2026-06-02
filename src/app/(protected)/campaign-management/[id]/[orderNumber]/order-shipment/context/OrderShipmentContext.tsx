'use client';

import { createContext, PropsWithChildren } from 'react';
import { useOrderShipmentClient } from './useOrderShipmentContext';

export const OrderShipmentContext = createContext({} as ReturnType<typeof useOrderShipmentClient>);

export interface OrderShipmentProviderProps extends PropsWithChildren {
  campaignId: string;
  orderNumber: number;
  encodedCampaignId: string;
  redirectTab: string;
}

export function OrderShipmentProvider({
  children,
  campaignId,
  orderNumber,
  encodedCampaignId,
  redirectTab,
}: OrderShipmentProviderProps) {
  const contextValue = useOrderShipmentClient({
    campaignId,
    orderNumber,
    encodedCampaignId,
    redirectTab,
  });

  return (
    <OrderShipmentContext.Provider value={contextValue}>{children}</OrderShipmentContext.Provider>
  );
}
