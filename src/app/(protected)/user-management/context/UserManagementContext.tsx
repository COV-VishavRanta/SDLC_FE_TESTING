'use client';

import { createContext } from 'react';

import useUserManagementContext from './useUserManagementContext';

export const UserManagementContext = createContext(
  {} as ReturnType<typeof useUserManagementContext>,
);

interface UserManagementProviderProps {
  children: React.ReactNode;
  currentUserRole?: string;
}

export function UserManagementProvider({ children, currentUserRole }: UserManagementProviderProps) {
  const contextValue = useUserManagementContext({ currentUserRole });

  return (
    <UserManagementContext.Provider value={contextValue}>{children}</UserManagementContext.Provider>
  );
}
