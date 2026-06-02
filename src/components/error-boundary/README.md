# Error Boundary

React Error Boundary for handling errors in Suspense components, particularly those using `useSuspenseQuery`.

## Why Error Boundaries?

With `useSuspenseQuery`, errors are **thrown** instead of returned in an `error` prop. React Error Boundaries catch these thrown errors and render fallback UI.

## Basic Usage

```tsx
import { ErrorBoundary } from '@/components';

function MyPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile /> {/* useSuspenseQuery inside */}
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Usage Patterns

### 1. Default Error UI

Uses the built-in error fallback with "Try again" button:

```tsx
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

### 2. Custom Static Fallback

```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

### 3. Custom Dynamic Fallback

Access the error and reset function:

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h2>Failed to load data</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

### 4. Layout-Level Error Boundary

Catch errors for all child routes:

```tsx
// app/(protected)/layout.tsx
export default function ProtectedLayout({ children }) {
  return (
    <ErrorBoundary>
      <AppSidebar>
        <AppTopbar />
        <Suspense fallback={<PageLoading />}>{children}</Suspense>
      </AppSidebar>
    </ErrorBoundary>
  );
}
```

### 5. Per-Section Error Boundaries

Isolate errors to specific UI sections:

```tsx
function Dashboard() {
  return (
    <div className='grid gap-6'>
      {/* If UserStats fails, ActivityFeed still works */}
      <ErrorBoundary fallback={<StatsSectionError />}>
        <Suspense fallback={<StatsSkeleton />}>
          <UserStats />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<FeedSectionError />}>
        <Suspense fallback={<FeedSkeleton />}>
          <ActivityFeed />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

## Error Handling Strategy

### Automatic Errors (Already Handled)

The `errorLink` in Apollo Client automatically handles:

- **401/403 errors** → Triggers token refresh → Retries query
- **Refresh failures** → Redirects to login

These never reach the Error Boundary.

### Errors that Reach Error Boundary

- Network failures (server down, no internet)
- GraphQL errors (500, invalid query, permission denied after refresh)
- Data validation errors
- Unexpected runtime errors

## Complete Example

```tsx
'use client';

import { ErrorBoundary } from '@/components';
import { useSuspenseQuery } from '@apollo/client';
import { Suspense } from 'react';

// Child component with query
function UserProfile() {
  const { data } = useSuspenseQuery(GET_CURRENT_USER);
  return <div>{data.me.name}</div>;
}

// Parent with error handling
function ProfilePage() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className='error-card'>
          <h2>Failed to load profile</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Best Practices

1. **Always wrap Suspense with ErrorBoundary**: Never use `<Suspense>` without an `<ErrorBoundary>` parent
2. **Granular boundaries**: Use multiple boundaries to isolate failures
3. **Meaningful fallbacks**: Show context-specific error messages
4. **Reset functionality**: Always provide a way to retry
5. **Log errors**: Use `componentDidCatch` to log to error tracking services

## Nesting Strategy

```tsx
// Root layout - catches catastrophic errors
<ErrorBoundary fallback={<RootError />}>
  <ApolloProvider>
    {/* Route layout - catches route-level errors */}
    <ErrorBoundary fallback={<RouteError />}>
      <Suspense fallback={<PageLoading />}>
        {/* Page - catches component-level errors */}
        <ErrorBoundary fallback={<SectionError />}>
          <Suspense fallback={<ComponentLoading />}>
            <Component />
          </Suspense>
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </ApolloProvider>
</ErrorBoundary>
```

## Related

- [Apollo Error Handling](../../lib/apollo/README.md)
- [Suspense Patterns](../../lib/README.md)
