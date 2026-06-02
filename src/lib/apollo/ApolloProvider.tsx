'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';

import { makeClient } from './apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

/**
 * Apollo Client Provider for wrapping client components that need GraphQL access.
 * Use this in layouts or specific client component trees that require Apollo.
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
