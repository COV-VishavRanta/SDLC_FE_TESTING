'use client';

import { createContext } from 'react';

import useWebhookContext from './useWebhookContext';

export const WebhookContext = createContext({} as ReturnType<typeof useWebhookContext>);

export function WebhookProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useWebhookContext();

  return <WebhookContext.Provider value={contextValue}>{children}</WebhookContext.Provider>;
}
