# Lib

This folder contains shared utilities, API clients, and core library code for the Pop Logic project.

## Structure

All library exports are available from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { ApolloProvider, ConfigureAmplifyClientSide } from '@/lib';
```

## Folder Structure

```
src/lib/
├── index.ts                    # Barrel export
├── utils.ts                    # Utility functions (e.g., cn for classnames)
├── amplify/
│   ├── index.ts                # Barrel export for Amplify
│   ├── amplify-config.ts       # AWS Amplify/Cognito configuration
│   └── amplify-auth-helper.ts  # Amplify authentication helpers
└── apollo/
    ├── index.ts                # Barrel export for Apollo
    ├── apollo-client.ts        # Apollo Client for Browser (makeClient)
    ├── ApolloProvider.tsx      # Client-side Apollo Provider
    ├── clientRefreshToken.ts   # Token refresh + backend update (all browser-side)
    └── errorLink.ts            # Apollo error link (handles 401s)
```

> **Note:** All data fetching and token refresh runs entirely in the browser.
> No Server Actions are used — the browser calls FastAPI directly so cookies
> (httpOnly Set-Cookie headers) are handled automatically by the browser.

## Guidelines

- Use camelCase for utility function names (e.g., `getClient`, `query`)
- Use PascalCase for React components/providers (e.g., `ApolloProvider`, `PreloadQuery`)
- Group related utilities by domain/feature in sub-folders
- Export all utilities from the subfolder's `index.ts`, then re-export from root `src/lib/index.ts`
- Include JSDoc comments describing function parameters, return types, and usage examples

---

## Available Utilities

### Amplify (`lib/amplify/`)

| Export                       | Type      | Environment | Description                                                    |
| ---------------------------- | --------- | ----------- | -------------------------------------------------------------- |
| `ConfigureAmplifyClientSide` | Component | Browser     | Initializes AWS Amplify for Cognito authentication             |
| `sendLoginOtp`               | Function  | Browser     | Sends OTP to user's email for password-less login              |
| `verifyLoginOtp`             | Function  | Browser     | Verifies OTP code sent to user's email, returns session/tokens |
| `resendLoginOtp`             | Function  | Browser     | Resends OTP code to user's email                               |
| `signOutUser`                | Function  | Browser     | Signs out the current user from Cognito                        |

### Apollo (`lib/apollo/`)

| Export               | Type      | Environment | Description                                          |
| -------------------- | --------- | ----------- | ---------------------------------------------------- |
| `makeClient`         | Function  | Browser     | Creates Apollo Client instance for client components |
| `ApolloProvider`     | Component | Browser     | Apollo Provider for wrapping client component trees  |
| `refreshAccessToken` | Function  | Browser     | Token refresh + backend update (called by errorLink) |
| `errorLink`          | Link      | Browser     | Apollo Error Link that auto-handles 401s with retry  |

### Utilities (`lib/`)

| Export | Type     | Environment | Description                                    |
| ------ | -------- | ----------- | ---------------------------------------------- |
| `cn`   | Function | Both        | Utility for merging Tailwind classes with clsx |

---

## Token Refresh Error Scenarios

| Error                        | Trigger                    | Behavior                                   |
| ---------------------------- | -------------------------- | ------------------------------------------ |
| 401 from GraphQL query       | `useSuspenseQuery`         | Auto-refresh → Retry → Success or Logout   |
| 401 from GraphQL mutation    | `useMutation`              | Auto-refresh → Retry → Success or Logout   |
| Multiple concurrent 401s     | Multiple queries/mutations | Deduplicated (single refresh request)      |
| RT expired during refresh    | `fetchAuthSession` fails   | Immediate logout + redirect to login       |
| Backend rejects new AT       | Backend refresh call fails | Backend logout → Cognito logout → Redirect |
| Network error during refresh | Network issue              | Logout flow                                |

## Adding New Utilities

1. **Identify the appropriate subfolder** or create a new one for the domain:
   - `amplify/` — Authentication, Cognito-related utilities
   - `apollo/` — GraphQL utilities (client-side only)
   - Create new folders for other domains (e.g., `payments/`, `analytics/`)

2. **Create the utility file** with proper naming convention:
   - Functions: `camelCase` (e.g., `formatCurrency.ts`)
   - Components: `PascalCase` (e.g., `PaymentProvider.tsx`)
   - Server Actions: `camelCase` with `'use server'` directive

3. **Include JSDoc comments** with description, parameters, and examples:

````tsx
/**
 * Validates and retrieves the current user session.
 *
 * @returns Promise resolving to the session or null if not authenticated
 *
 * @example
 * ```ts
 * const session = await getSession();
 * if (session) {
 *   console.log(session.user);
 * }
 * ```
 */
export async function getSession() {
  // Implementation
}
````

4. **Export from the subfolder's `index.ts`**:

```tsx
// src/lib/auth/index.ts
export { getSession } from './session';
export { validateToken } from './validation';
```

5. **Re-export from the root `src/lib/index.ts`**:

```tsx
// src/lib/index.ts
export * from './amplify';
export * from './apollo';
export * from './auth'; // New domain
```

6. **Write tests** (co-located with utility):

```tsx
// src/lib/auth/session.test.ts
import { getSession } from './session';

describe('getSession', () => {
  it('should return session when authenticated', async () => {
    // Test implementation
  });
});
```

---

## Migration Guide

### From Manual 401 Handling to Automatic

**Before:**

```tsx
'use client';

import { useSuspenseQuery } from '@apollo/client';

export function UserProfile() {
  const { data, error } = useSuspenseQuery(GET_USER);

  // ❌ Manual 401 handling
  useEffect(() => {
    if (error?.message.includes('401')) {
      // Manual refresh logic
      refreshTokens().then(() => refetch());
    }
  }, [error]);

  return <div>{data.user.name}</div>;
}
```

**After:**

```tsx
'use client';

import { useSuspenseQuery } from '@apollo/client';

export function UserProfile() {
  // ✅ Automatic 401 handling via errorLink
  const { data } = useSuspenseQuery(GET_USER);

  // No error handling needed!
  return <div>{data.user.name}</div>;
}
```

### Data Fetching with Per-Component Loading

Use `useSuspenseQuery` + `<Suspense>` for per-component loading states:

```tsx
// page.tsx (Server Component — no data fetching)
import { Suspense } from 'react';
import { UserProfile } from '@/components';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile />
      </Suspense>
    </div>
  );
}

// UserProfile.tsx (Client Component)
('use client');
import { useSuspenseQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql';

export function UserProfile() {
  const { data } = useSuspenseQuery(GET_CURRENT_USER);
  return <div>{data.me.name}</div>;
}
```

---

## Architecture Decisions

### Why Client-Side Only Fetching?

All authenticated data fetching happens in Client Components via Apollo hooks.

**Reasons:**

1. **Cookie limitation:** Next.js does not allow `cookies().set()` during Server Component rendering — this broke the token refresh flow in RSC
2. **Single auth implementation:** Only one refresh path (Amplify in browser) instead of two
3. **No SEO needed:** Protected pages are behind auth — search engines never see them
4. **Simpler mental model:** Auth lives entirely in the browser where Cognito/Amplify runs

### Why Direct Browser Fetch for Token Refresh?

The backend `RefreshToken` mutation is called directly from the browser (not via a Server Action):

1. **Automatic cookie handling:** Browser sends httpOnly cookies and stores Set-Cookie headers natively
2. **Zero forwarding code:** No `cookies()` API, no parsing Set-Cookie headers, no Server Action
3. **Everything in one file:** `clientRefreshToken.ts` handles both Cognito refresh and backend update

### Why Redirect to `/login` (Not a Separate Logout Page)?

**Problem:** Server Components/Actions cannot call `signOut()` (client-only Amplify function)

**Solution:** Redirect directly to `/login` where LoginForm automatically handles `signOut()` on mount

**Benefits:**

- ✅ Simpler flow (one redirect instead of two)
- ✅ Proper Cognito session cleanup (LoginForm calls `signOut()` on mount)
- ✅ Consistent logout behavior (manual logout and session expiration use same path)
- ✅ No separate logout page to maintain
- ✅ Type-safe (no "use client" mixing with RSC)

---

## Environment Variables

| Variable                           | Usage                             | Example                         | Required |
| ---------------------------------- | --------------------------------- | ------------------------------- | -------- |
| `NEXT_PUBLIC_GRAPHQL_API_URL`      | GraphQL API endpoint (client+RSC) | `http://localhost:8000/graphql` | Yes      |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Cognito User Pool ID              | `us-west-2_XXXXXXXXX`           | Yes      |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID`    | Cognito App Client ID             | `xxxxxxxxxxxxxxxxxxxxxxxxxx`    | Yes      |

> **Note:** All variables use `NEXT_PUBLIC_` prefix to be available in both server and browser.
>
> **Security Note:** The Cognito Client ID and User Pool ID are public identifiers and safe to expose client-side. Authentication is handled via secure httpOnly cookies for the access token.

---

## Best Practices

### ✅ Do

- **Use `useSuspenseQuery`** for all authenticated GraphQL queries in Client Components
- **Wrap data-fetching components with `<Suspense>`** for per-component loading states
- **Use `ApolloProvider`** at root layout to enable automatic 401 handling
- **Let errorLink handle 401s** — No manual error handling needed
- **Redirect to `/login` from Server Components** when logout is needed (LoginForm handles `signOut()` automatically)
- **Handle partial failures gracefully** — Even if backend logout fails, LoginForm clears Cognito session

### ❌ Don't

- **Don't fetch authenticated data in Server Components** — Use Client Components with `useSuspenseQuery`
- **Don't manually handle 401s in Client Components** — Let errorLink do it automatically
- **Don't use `useEffect` + `useState` for data fetching** — Use `useSuspenseQuery` + `<Suspense>`
- **Don't call backend APIs directly for token refresh** — Use the provided utilities
- **Don't forget error boundaries** — Wrap Suspense boundaries with error boundaries for robustness

### Performance Tips

- ✅ **Deduplicated refreshes**: Multiple concurrent 401s trigger only one refresh
- ✅ **Automatic retry**: Failed requests are retried automatically after successful refresh
- ✅ **Minimal re-authentication**: Only logout when RT expires or backend rejects new AT
- ✅ **Per-component loading**: `useSuspenseQuery` + `<Suspense>` enables granular loading UX

---

## Summary

The `lib/` folder provides a robust, production-ready authentication and data fetching layer for the Pop Logic application:

### Key Features

✅ **Automatic 401 Handling**: Client and Server Components automatically handle authentication errors  
✅ **Token Refresh Flow**: Seamless token refresh using AWS Cognito with automatic retry  
✅ **Deduplication**: Multiple concurrent 401s trigger only one refresh request  
✅ **Type Safety**: Full TypeScript support with proper type guards  
✅ **Error Boundaries**: Comprehensive error handling for all failure scenarios  
✅ **Performance**: Optimized refresh logic with minimal re-authentication

### Quick Reference

| Scenario                             | Use This                                       |
| ------------------------------------ | ---------------------------------------------- |
| GraphQL query in Client Component    | `useSuspenseQuery(query, { variables })`       |
| GraphQL mutation in Client Component | `useMutation(mutation)`                        |
| Per-component loading state          | Wrap with `<Suspense fallback={<Skeleton />}>` |
| Manual logout (Client Component)     | `await signOut()` then `router.push('/login')` |
| Manual logout (Server Component)     | `redirect('/login')` (auto-signout on mount)   |
| Access Cognito token (Client)        | `await fetchAuthSession()`                     |
| Initialize Amplify                   | `<ConfigureAmplifyClientSide />`               |
| Wrap Client Components with Apollo   | `<ApolloProvider>{children}</ApolloProvider>`  |

### Documentation References

- **Next.js Best Practices**: `.github/instructions/nextjs.instructions.md`
- **GraphQL/Apollo Patterns**: `.github/instructions/graphql-apollo.instructions.md`
- **Authentication Flow**: `docs/features/auth/authentication.architecture.md`
- **Token Refresh Flow**: `docs/features/auth/token-refresh.architecture.md`
- **Login Architecture Behavior**: `docs/features/auth/login.architecture.md`

---

**Last Updated:** February 13, 2026  
**Version:** 3.0 (Client-Side Only Fetching)

`````
````
`````
