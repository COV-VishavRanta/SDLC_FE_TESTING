# Contexts

This folder contains React Context providers for managing global application state.

## Organization

- Each context has its own file (e.g., `GlobalProtectedContext.tsx`)
- Contexts are exported through `index.ts` for clean imports
- Providers should be "use client" components
- Custom hooks (e.g., `useGlobalProtected`) are exported alongside providers

## Usage

```tsx
// In Server Component (e.g., layout.tsx)
import { GlobalProtectedProvider } from '@/contexts';

export default async function Layout({ children }) {
  const serverData = await fetchData();

  return <GlobalProtectedProvider data={serverData}>{children}</GlobalProtectedProvider>;
}
```

```tsx
// In Client Component
'use client';

import { useGlobalProtected } from '@/contexts';

export function MyComponent() {
  const { data } = useGlobalProtected();
  // Use data...
}
```

## Current Contexts

- **GlobalProtectedContext**: Provides roles and global data for protected routes
