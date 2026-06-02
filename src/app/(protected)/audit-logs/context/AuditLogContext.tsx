'use client';
import { createContext } from 'react';
import useAuditLogContext from './useAuditLogContext';

export const AuditLogContext = createContext({} as ReturnType<typeof useAuditLogContext>);

export default function AuditLogProvider({ children }: { children: React.ReactNode }) {
  const auditLogContext = useAuditLogContext();
  return <AuditLogContext.Provider value={auditLogContext}>{children}</AuditLogContext.Provider>;
}
