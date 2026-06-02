# Constants

This folder contains all the constants and enums for the Pop Logic project.

## Structure

All constants are exported from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { API_BASE_URL, ROUTES, UserRole } from '@/constant';

// Or import enums directly
import { UserRole } from '@/constant/enums';
```

## Folder Structure

```
src/constant/
├── index.ts           # Barrel export (exports everything)
├── api.ts             # API endpoints, base URLs
├── routes.ts          # App route paths
├── config.ts          # App configuration values
├── messages.ts        # Error/success messages, labels
└── enums/
    ├── index.ts       # Barrel export for enums
    └── {name}.enum.ts # Domain-specific enums
```

## Guidelines

- Use UPPER_SNAKE_CASE for constant values
- Use PascalCase for enum names
- Group related constants in the same file
- Export all constants from the root `src/constant/index.ts` file
- Export all enums from `src/constant/enums/index.ts`

## Available Files

| File                      | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `enum/auth-error.enum.ts` | Authentication error and validation enums |
| `routes.ts`               | Centralized route paths for the app       |

---

## Adding a New Constant

1. Identify the appropriate file for your constant (or create a new one if needed)
2. Add your constant with proper naming convention
3. Export the constant from the root `src/constant/index.ts`

Example:

```tsx
// src/constant/api.ts
export const API_BASE_URL = 'https://api.example.com';
export const API_TIMEOUT = 30000;

// src/constant/index.ts
export * from './api';
```

---

## Adding a New Enum

1. Create a new file in the `enums/` folder: `{name}.enum.ts`
2. Define your enum with PascalCase naming
3. Export the enum from `src/constant/enums/index.ts`

Example:

```tsx
// src/constant/enums/user.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// src/constant/enums/index.ts
export * from './user.enum';
```
