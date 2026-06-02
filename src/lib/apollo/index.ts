// Apollo Client — Client Components (browser + SSR hydration)
export { makeClient } from './apollo-client';
export { ApolloProvider } from './ApolloProvider';
export * from './clientRefreshToken';
export { sanitizeLink, XssDetectedError } from './sanitizeLink';

// Apollo Client — React Server Components (RSC)
//
// ⚠️  Do NOT export from `apollo-rsc.ts` here.
//     `registerApolloClient` is only available in the RSC bundle.
//     Server Components must import directly:
//
//     import { query, getClient, PreloadQuery } from '@/lib/apollo/apollo-rsc';
//
