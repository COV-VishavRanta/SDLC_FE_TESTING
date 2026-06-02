import { ApolloLink, HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { disableFragmentWarnings } from 'graphql-tag';
import { errorLink } from './errorLink';
import { sanitizeLink } from './sanitizeLink';

// Suppress "fragment with name X already exists" warnings that occur when the
// same fragment constant is interpolated into multiple gql documents.
disableFragmentWarnings();

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? 'http://localhost:8000/graphql';

/**
 * Creates an Apollo Client instance for use in Client Components (browser).
 * This client supports SSR hydration and client-side state management.
 *
 * Features:
 * - SSR guard: Skips authenticated requests during server rendering
 * - Automatic token refresh on 401 errors via errorLink
 * - Credentials include for httpOnly cookies (browser only)
 */
export function makeClient() {
  /**
   * Server-safe HttpLink — on the server we use a custom fetch that
   * returns an empty GraphQL response (`{ data: null }`) without making
   * a real network request.  This avoids 401s during SSR (no cookies)
   * while letting `useSuspenseQuery` resolve with `null` data so the
   * component tree is consistent between server and client.
   *
   * On the client, the standard fetch with `credentials: 'include'` is
   * used so httpOnly cookies are sent automatically.
   */
  const isServer = typeof window === 'undefined';

  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetchOptions: isServer ? {} : { credentials: 'include' },
    ...(isServer && {
      // eslint-disable-next-line require-await
      fetch: async (uri, options) => {
        try {
          // Parse the outgoing GraphQL request body
          const body = JSON.parse(options?.body as string);
          const queryStr = body.query;

          // Regex logic:
          // 1. Find the first '{'
          // 2. Capture the first word after it (the root field)
          // This handles: query Name { field { ... } } AND query { field { ... } }
          const rootFieldMatch = queryStr.match(/\{\s*(\w+)/);
          const fieldName = rootFieldMatch ? rootFieldMatch[1] : null;

          const mockData = fieldName ? { [fieldName]: null } : null;

          return new Response(JSON.stringify({ data: mockData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch {
          // Fallback for unexpected request formats
          return new Response(JSON.stringify({ data: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    }),
  });

  const timezoneLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
      headers: {
        ...headers,
        'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }));
    return forward(operation);
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, timezoneLink, sanitizeLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only', // Prevent caching 401 responses
      },
      query: {
        fetchPolicy: 'network-only', // Force network requests
      },
    },
  });
}
