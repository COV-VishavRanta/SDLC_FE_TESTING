'use client';

import { UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { createContext } from 'react';

import useShipmentContext from './useShipmentContext';

export const ShipmentContext = createContext({} as ReturnType<typeof useShipmentContext>);

export function ShipmentProvider({ children }: { children: React.ReactNode }) {
  const { selectedPspId, selectedBrandId, selectedStoreId, currentUserData } = useGlobalProtected();

  const roleName = currentUserData?.me?.roles?.[0]?.name ?? '';

  let pspId: string | undefined;
  let brandId: string | undefined;
  let storeId: string | undefined;
  switch (roleName) {
    case UserRole.PSP_ADMIN:
    case UserRole.PRODUCTION_OPERATOR:
      pspId = selectedPspId ?? undefined;
      break;
    case UserRole.BRAND_ADMIN:
    case UserRole.CAMPAIGN_MANAGER:
      brandId = selectedBrandId ?? undefined;
      break;
    case UserRole.STORE_ADMIN:
    case UserRole.STORE_OPERATOR:
    case UserRole.REGIONAL_MANAGER:
      storeId = selectedStoreId ?? undefined;
      break;
    default:
      pspId = undefined;
      brandId = undefined;
      storeId = undefined;
  }

  const contextValue = useShipmentContext({
    pspId,
    brandId,
    storeId,
  });

  return <ShipmentContext.Provider value={contextValue}>{children}</ShipmentContext.Provider>;
}
