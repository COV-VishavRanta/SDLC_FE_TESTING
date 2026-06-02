'use client';

import {
  BRAND_NOTIFICATION_ROLES,
  PSP_NOTIFICATION_ROLES,
  STORE_NOTIFICATION_ROLES,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { usePermissions } from '@/hooks';
import { createContext } from 'react';

import useAlertsContext from './useAlertsContext';

export const AlertsContext = createContext({} as ReturnType<typeof useAlertsContext>);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();
  const { role } = usePermissions();
  const isPspRole = PSP_NOTIFICATION_ROLES.has(role as never);
  const isBrandRole = BRAND_NOTIFICATION_ROLES.has(role as never);
  const isStoreRole = STORE_NOTIFICATION_ROLES.has(role as never);

  const contextValue = useAlertsContext(
    isBrandRole ? selectedBrandId : undefined,
    isPspRole ? selectedPspId : undefined,
    isStoreRole ? selectedStoreId : undefined,
  );

  return <AlertsContext.Provider value={contextValue}>{children}</AlertsContext.Provider>;
}
