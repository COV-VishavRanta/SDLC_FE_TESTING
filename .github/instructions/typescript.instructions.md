---
description: 'TypeScript coding standards, type safety patterns, and naming conventions for strict-mode Next.js projects with React 19.'
applyTo: '**/*.ts, **/*.tsx'
---

# TypeScript Best Practices

Standards derived from the project's `tsconfig.json` (strict mode, bundler resolution) and enforced ESLint rules.

---

## 1. Strict Mode & Type Safety

- **Never use `any`** — use `unknown` and narrow with type guards, discriminated unions, or assertion functions.
- **Prefer `unknown` over `any`** for values of uncertain shape (API responses, catch blocks, third-party data).
- **Enable and respect all strict flags** — `strict: true` is the baseline; do not add `@ts-ignore` or `@ts-expect-error` without a justifying comment.
- **Use `satisfies`** for compile-time validation without widening the inferred type:

```ts
const ROUTES = [{ name: 'Dashboard', href: '/dashboard' }] as const satisfies RouteProps[];
```

## 2. Interfaces vs Types

- **Use `interface`** for object shapes, component props, API response structures, and anything that may be extended:

```ts
interface PaginationInfo {
  totalCount: number;
  page: number;
  pageSize: number;
}
```

- **Use `type`** for unions, intersections, mapped types, and utility derivations:

```ts
type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING';
type WithId<T> = T & { id: string };
```

## 3. Naming Conventions

| Artifact          | Convention                                                                        | Example                                  |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| Interfaces        | `PascalCase`, suffix with `Type` for domain models or `Props` for component props | `UserType`, `ButtonProps`                |
| Type aliases      | `PascalCase`                                                                      | `SortOrder`, `ClassValue`                |
| Enums             | `PascalCase` with `Enum` suffix                                                   | `CampaignStatusEnum`, `UserRoleEnum`     |
| Enum members      | `UPPER_SNAKE_CASE` with string values                                             | `DRAFT = 'DRAFT'`                        |
| Generics          | Single uppercase letter or short descriptive name                                 | `<T>`, `<TItem>`                         |
| Constants         | `UPPER_SNAKE_CASE`                                                                | `MAX_FILE_SIZE_MB`, `SEARCH_DEBOUNCE_MS` |
| Functions / hooks | `camelCase`; hooks prefixed with `use`                                            | `getInitials`, `usePermissions`          |
| Files – types     | `{feature}.types.ts`                                                              | `graphql.types.ts`                       |
| Files – enums     | `{feature}.enum.ts` or `{feature}.enums.ts`                                       | `user.enums.ts`                          |
| Files – constants | `{feature}.constants.ts`                                                          | `validation.constants.ts`                |

## 4. Enums

- **Always use string enums** with literal `UPPER_SNAKE_CASE` values matching the key:

```ts
export enum CampaignStatusEnum {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
}
```

- **No mixed enums** — ESLint rule `@typescript-eslint/no-mixed-enums` is enforced.
- **Prefer literal enum members** — `@typescript-eslint/prefer-literal-enum-member` is enforced.
- Place enums in `src/constant/enums/{feature}.enum.ts` and re-export from `src/constant/index.ts`.

## 5. Component Props Typing

- Define props with `interface` named `{ComponentName}Props`, co-located in the component file:

```ts
interface ViewImageProps {
  imageKey: string;
  renderButton: RenderType;
  className?: string;
}

export default function ViewImage({ imageKey, renderButton, className }: ViewImageProps) { ... }
```

- For inline one-off props, destructure directly in the parameter:

```ts
export function AppSideBarNavItem({ item }: { item: NavItem }) { ... }
```

- **Use `React.ComponentProps<typeof X>`** to derive prop types from existing components rather than re-declaring.

## 6. Function Signatures

- **Explicitly type return values** on exported functions, hooks, and utilities:

```ts
export function usePermissions(): UsePermissionsReturn { ... }
export function encodeId(uuid: string): string { ... }
export function isValidDate(value: string | Date): boolean { ... }
```

- **Use generics** for reusable hooks and utilities:

```ts
export function useCapabilities<T>(map: CapabilitiesMap<T>, defaults: T): T { ... }
export function useClientPagination<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
) { ... }
```

## 7. Imports & Module Organization

- **Use the `@/*` path alias** for all `src/` imports — never use relative paths that escape the current directory (`../../`):

```ts
import { UserType } from '@/types';
import { Permission } from '@/constant/enums/permissions.enum';
```

- **Barrel exports** — every `src/` subfolder has an `index.ts` that re-exports its public API. Always export new additions from the barrel.
- **No duplicate imports** — ESLint rule `no-duplicate-imports` (with `includeExports: true`) is enforced.

## 8. `as const` & Readonly Patterns

- Use `as const` for constant arrays and objects to preserve literal types:

```ts
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
```

- Combine with `satisfies` when type checking is needed without widening.

## 9. Null & Undefined Handling

- **Use `??` (nullish coalescing)** instead of `||` for default values — `@typescript-eslint/prefer-nullish-coalescing` is enforced.
- **Use `?.` (optional chaining)** instead of manual null checks — `@typescript-eslint/prefer-optional-chain` is enforced.
- **Mark optional fields with `?:`** rather than `| undefined` in interfaces:

```ts
interface UserType {
  id: string;
  name?: string; // correct
  // name: string | undefined  // avoid
}
```

## 10. Error Handling

- **Only throw `Error` objects** — `@typescript-eslint/only-throw-error` is enforced.
- **Type catch variables as `unknown`** and narrow before use:

```ts
try {
  await fetchData();
} catch (err) {
  const error = err instanceof Error ? err : new Error('Unknown error');
  throw error;
}
```

## 11. Array & Object Patterns

- **Prefer `for...of`** over index-based for loops — `@typescript-eslint/prefer-for-of` is enforced.
- **Use `Array<T>`** syntax consistently — `@typescript-eslint/array-type` is enforced.
- **Use `Record<K, V>`** for index-signature objects:

```ts
extensions?: Record<string, unknown>;
```

- **Require comparator for `Array.sort()`** — `@typescript-eslint/require-array-sort-compare` is enforced.

## 12. Constants & Magic Numbers

- **Extract magic numbers into named constants** in `src/constant/`:

```ts
// constant/table.constants.ts
const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 800;
```

- Group related constants in structured objects:

```ts
export const VALIDATION_LENGTH = {
  NAME: { MIN: 2, MAX: 200 },
  CAMPAIGN: { NAME: { MIN: 3, MAX: 100 } },
};
```

## 13. GraphQL Type Conventions

- Define response and variable interfaces alongside the query/mutation they serve:

```ts
export interface GetImageUrlByKeyResponse {
  getImageUrlByKey: string;
}

export interface GetImageUrlByKeyVariables {
  key: string;
}
```

- Use `GraphQLResponse<T>` wrapper for generic response handling.
- Domain model interfaces (e.g., `UserType`, `CampaignType`) live in `src/types/graphql.types.ts`.

## 14. Rules Enforced by ESLint

These TypeScript-specific ESLint rules are active — generated code must comply:

- `prefer-const` — use `const` when variable is never reassigned
- `prefer-destructuring` — destructure objects and arrays where possible
- `prefer-arrow-callback` — use arrow functions for callbacks
- `prefer-spread` — use spread operator instead of `.apply()`
- `eqeqeq` — always use `===` / `!==`
- `no-var` — never use `var`
- `require-await` — async functions must contain `await`
- `no-await-in-loop` — avoid `await` inside loops; use `Promise.all()` instead
- `@typescript-eslint/no-unnecessary-template-expression` — no redundant template literals
- `@typescript-eslint/no-dynamic-delete` — avoid `delete obj[key]`
- `@typescript-eslint/no-array-delete` — avoid `delete arr[index]`
- `@typescript-eslint/unified-signatures` — merge overloads when possible
