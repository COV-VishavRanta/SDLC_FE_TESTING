# GraphQL

This folder contains all the GraphQL operations (queries, mutations, and fragments) for the Pop Logic project.

## Structure

All GraphQL operations are exported from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { GET_USER, CREATE_USER, USER_FRAGMENT } from '@/graphql';
```

## Folder Structure

```
src/graphql/
├── index.ts                # Barrel export
├── fragments/
├── mutations/
│   └── auth              # Authentication-related mutations
│       └── auth.mutation.ts
|       └── auth.types.ts
└── queries/
    ├── index.ts            # Barrel export for queries
    └── user.queries.ts
```

## Guidelines

- Use UPPER_SNAKE_CASE for GraphQL operation names (e.g., `GET_USER`, `CREATE_USER`)
- Use `.query.ts` suffix for query files
- Use `.mutation.ts` suffix for mutation files
- Use `.fragment.ts` suffix for fragment files
- Group related operations by feature/domain (e.g., `user.query.ts`, `auth.mutation.ts`)
- Export all operations from the subfolder's `index.ts`, then re-export from root `src/graphql/index.ts`
- Include JSDoc comments describing complex operations
- All the types related to GraphQL operations should be defined inside the same file with `.types.ts` suffix (e.g., `auth.mutation.ts` and `auth.types.ts`)
- Types should be documented with JSDoc comments

## Available Operations

### Queries

_No queries have been added yet._

### Mutations

- `LOGIN`: Exchanges Cognito tokens (`idToken`, `accessToken`) with the backend and returns whether the user is authenticated.
- `LOGOUT`: Clears the server-side session (typically clears authentication cookies).
- `REFRESH_TOKEN`: Used by backend to replace existing access_token from the cookie with a new one, extending the session without requiring the user to log in again.

### Fragments

_No fragments have been added yet._

---

## Adding New Operations

1. Identify the appropriate subfolder (`queries/`, `mutations/`, or `fragments/`)
2. Create or update the feature file with proper naming convention, naming convention should be `{entity}.query.ts` for queries, `{entity}.mutation.ts` for mutations, and `{entity}.fragment.ts` for fragments
3. Create types in the same file with `.types.ts` suffix if needed
4. Export from the `src/graphql/index.ts` as barrel export for easy imports across the app
