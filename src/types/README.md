# Types

This folder contains all the common and reusable TypeScript types and interfaces for the Pop Logic project.

## Structure

All types are exported from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { User, ApiResponse, PaginatedResponse } from '@/types';
```

## Folder Structure

```
src/types/
├── index.ts           # Barrel export
├── graphql.types.ts     # GraphQL-related types
└── {feature}.types.ts # Feature-specific types
```

## Guidelines

- Use PascalCase for type and interface names (e.g., `User`, `ApiResponse`)
- Use the `I` prefix for interfaces only when necessary to distinguish from classes
- Prefer `type` for unions and intersections, `interface` for object shapes
- Group related types in feature-based files (e.g., `user.types.ts`, `auth.types.ts`)
- Use `.types.ts` suffix for type files
- Export all types from the root `src/types/index.ts` file
- Include JSDoc comments describing complex types

## Available Types

_No types have been added yet._

---

## Adding New Types

1. Identify the appropriate file for your type (or create a new feature file if needed)
2. Define your type/interface with proper naming convention
3. Export the type from the root `src/types/index.ts`
