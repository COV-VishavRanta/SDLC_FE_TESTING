'use client';

import { EntityType, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { createContext } from 'react';

import useExceptionRequestContext from './useExceptionRequestContext';

export const ExceptionRequestContext = createContext(
  {} as ReturnType<typeof useExceptionRequestContext>,
);

export function ExceptionRequestProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrandId, selectedStoreId, currentUserData } = useGlobalProtected();

  const roleName = currentUserData?.me?.roles?.[0]?.name ?? '';

  let entityId: string | undefined;
  let entityType: EntityType | undefined;
  switch (roleName) {
    case UserRole.BRAND_ADMIN:
    case UserRole.CAMPAIGN_MANAGER:
      entityId = selectedBrandId ?? undefined;
      entityType = EntityType.BRAND;
      break;
    case UserRole.STORE_ADMIN:
    case UserRole.STORE_OPERATOR:
    case UserRole.REGIONAL_MANAGER:
      entityId = selectedStoreId ?? undefined;
      entityType = EntityType.STORE;
      break;
    default:
      entityId = undefined;
      entityType = undefined;
  }

  const contextValue = useExceptionRequestContext({
    roleName,
    entityId,
    entityType,
  });

  return (
    <ExceptionRequestContext.Provider value={contextValue}>
      {children}
    </ExceptionRequestContext.Provider>
  );
}
