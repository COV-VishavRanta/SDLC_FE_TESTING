# Pop Logic Frontend - Copilot Instructions

## Architecture Overview

Next.js 16 App Router application serving as **Frontend + BFF** (Backend for Frontend). Uses React 19 with React Compiler enabled (`reactCompiler: true` in [next.config.ts](../next.config.ts)).

### Source Structure

All source code lives in `src/` with barrel exports via `index.ts` in each folder:

| Folder        | Purpose                        | Import Pattern                     |
| ------------- | ------------------------------ | ---------------------------------- |
| `app/`        | Pages, layouts, route handlers | N/A (filesystem routing)           |
| `components/` | Reusable UI components         | `import { X } from '@/components'` |
| `hooks/`      | Custom React hooks             | `import { useX } from '@/hooks'`   |
| `types/`      | TypeScript interfaces/types    | `import { X } from '@/types'`      |
| `constant/`   | Constants + `enums/` subfolder | `import { X } from '@/constant'`   |
| `utils/`      | Pure utility functions         | `import { X } from '@/utils'`      |

## Developer Workflow

```bash
npm run dev          # Lint first, then start dev server (Turbopack)
npm run build        # Lint first, then production build
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

**Important:** `dev` and `build` scripts run linting first—fix lint errors before expecting the server to start.

## Coding Conventions

### File & Naming

- **Components:** `kebab-case` folders containing `{Name}.tsx` + optional `{Name}.test.tsx`
- **Hooks:** `camelCase` files with `use` prefix (`useDebounce.ts`)
- **Types:** `{feature}.types.ts` files (`user.types.ts`, `api.types.ts`)
- **Constants:** `UPPER_SNAKE_CASE` values; enums in `constant/enums/{name}.enum.ts`
- **Utils:** `camelCase` functions grouped by category (`format.ts`, `validation.ts`)

### Server vs Client Components

- Default to **Server Components** (no directive needed)
- Add `'use client'` only for interactivity, state, or browser APIs
- **Never use** `next/dynamic` with `{ ssr: false }` in Server Components

### TypeScript

- Strict mode enabled; avoid `any`—use `unknown` + narrowing
- Use `interface` for object shapes, `type` for unions/intersections
- Path alias: `@/*` maps to `src/*`

### ESLint Rules to Know

The project enforces strict rules via [eslint.config.mjs](../eslint.config.mjs):

- `no-console` → Use proper logging utilities
- `no-magic-numbers` → Extract constants (enums/numbers ignored)
- `@typescript-eslint/no-unnecessary-condition` → No redundant conditionals
- `prefer-nullish-coalescing` / `prefer-optional-chain` → Modern syntax required

## Patterns to Follow

### Adding New Code

1. **Components:** Create `components/{Name}/{Name}.tsx`, export from `components/index.ts`
2. **Hooks:** Create `hooks/use{Name}.ts`, export from `hooks/index.ts`
3. **Types:** Add to existing `types/{feature}.types.ts` or create new, export from `types/index.ts`

### API Routes (BFF Pattern)

- There is an FAST API backend (in other repo); we will only be using RSC and server action on the server components as a part of BFF pattern.

### Caching (Next.js 16)

- Use `use cache` directive for cacheable components/functions
- Use `cacheTag()` and `cacheLife()` for fine-grained control
- Avoid deprecated `unstable_cache`

### shadcn/ui Components

- **Always use the shadcn MCP server** to get the latest information about components before implementing or modifying them
- **Prefer shadcn/ui components** over building custom UI components when a shadcn component exists
- **Use the CLI** to add or update components:
  ```bash
  npx shadcn@latest add [component-name]
  ```
- **ESLint issues:** If shadcn components generate ESLint warnings, disable them with top-of-file comments:
  ```tsx
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  ```
- **Always export** shadcn/ui components from `components/index.ts` as barrel exports:
  ```tsx
  // components/index.ts
  export * from './ui/button';
  export * from './ui/card';
  ```

## Tech Stack Quick Reference

| Tool          | Version | Notes                              |
| ------------- | ------- | ---------------------------------- |
| Next.js       | 16.1.6  | App Router, React Compiler enabled |
| React         | 19.2.3  | Concurrent features                |
| Apollo Client | 4.x     | GraphQL Client (RSC + Browser)     |
| TypeScript    | 5.9.3   | Strict mode                        |
| Tailwind CSS  | 4.x     | Utility-first styling              |
| shadcn/ui     | Latest  | Accessible UI components           |
| Base UI       | Latest  | Unstyled component foundation      |
| ESLint        | 9.x     | Flat config format                 |

## Key Files

- [.github/instructions/nextjs.instructions.md](instructions/nextjs.instructions.md) — Detailed Next.js patterns
- [.github/instructions/typescript.instructions.md](instructions/typescript.instructions.md) — TypeScript guidelines
- [.github/instructions/graphql-apollo.instructions.md](instructions/graphql-apollo.instructions.md) — GraphQL & Apollo Client patterns
- Each `src/` subfolder has a `README.md` with folder-specific conventions
