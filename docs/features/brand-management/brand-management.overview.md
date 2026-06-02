# Brand Management Module Overview

The Brand Management module allows administrators to manage brands within the system. This includes creating new brands, editing existing ones, activating/deactivating brands, and viewing a list of brands with filtering capabilities.

## Architecture

The module is built using the Next.js App Router and located at `src/app/(protected)/brand-management`. It uses a Context API pattern (`BrandManagementContext`) to manage global state such as the brand list, filter state, and pagination info, avoiding prop drilling.

### Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────┐
│  BrandManagementPage (RSC — app/(protected)/brand-management)      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  BrandManagementProvider (Client Context)                    │  │
│  │                                                              │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────────┐  │  │
│  │  │  BrandCreation   │  │  SectionErrorBoundary            │  │  │
│  │  │  Button (Client) │  │  └─ <Suspense>                   │  │  │
│  │  └──────────────────┘  │     └─ BrandStatCards (Client)   │  │  │
│  │                        └──────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────────┐  │  │
│  │  │  BrandFilters    │  │  SectionErrorBoundary            │  │  │
│  │  │  (Client)        │  │  └─ <Suspense>                   │  │  │
│  │  └──────────────────┘  │     └─ BrandTable (Client)       │  │  │
│  │                        │        └─ BrandActionCell        │  │  │
│  │                        └──────────────────────────────────┘  │  │
│  │                                                              │  │
│  │              BrandManagementContext                          │  │
│  │  (useSuspenseQuery GET_BRANDS · useMutation UPDATE_STATUS)   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │  Apollo Client (Browser)        │
              │  GET_BRANDS · UPDATE_BRAND_STATUS│
              └────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │  FastAPI Backend (GraphQL)      │
              └────────────────────────────────┘
```

### Directory Structure

- **Page Root**: `page.tsx` — RSC that wraps content in `BrandManagementProvider` and renders stat cards, filters, and table inside `SectionErrorBoundary` / `Suspense` shells.
- **Context**:
  - `context/BrandManagementContext.tsx` — Provider shell that reads `selectedPspId` from `GlobalProtectedContext` and passes it to the hook.
  - `context/useBrandManagementContext.ts` — All state, queries, mutations, and handlers. Returns the full context value.
- **Components**:
  - `(components)/brand-filters/` — Search input + status select + reset button.
  - `(components)/brand-stat-cards/` — Total / Active / Inactive stat cards, data sourced from `brandData` in context.
  - `(components)/brand-table/` — `BrandTable` (table) + `BrandActionCell` (per-row actions) + loading skeletons.
  - `(components)/create-brand-button/` — "New Brand" button; opens `BrandDialog` in create mode.
  - `(components)/activate-deactivate-dialog/` — `ActivateBrandDialog` and `DeactivateBrandDialog`; receive handlers as props from `BrandActionCell`.
- **Shared Dialogs** (in `src/components/dialog/`):
  - `brand-dialog/` — Reusable create/edit dialog used by both `BrandCreationButton` and `BrandActionCell`.
- **Brand Details** (`[id]/`):
  - `page.tsx` — RSC shell; decodes URL-safe ID via `decodeId()`.
  - `brand-details-view.tsx` — Client Component; renders brand info, inline edit/activate/deactivate actions.
  - `useBrandDetailsView.tsx` — Custom hook; owns all queries and mutation state for the details view.

## Key Features

1. [**Listing & Filtering**](./brand-listing-filtering.md): View brands with pagination, sorting, and filters (search, status). Default filter is **Active** brands.
2. [**Creation & Editing**](./brand-creation-editing.md): Create new brands (followed by a prompted Brand Admin user creation) and edit brand details.
3. [**Activation & Deactivation**](./brand-activation.md): Manage the active status of brands, including an incomplete-campaign blocker on deactivation.
4. [**Brand Details**](./brand-details.overview.md): Dedicated detail page (`/brand-management/[id]`) with inline edit, activate, and deactivate actions.

## Data Fetching

Data is fetched via Apollo Client inside `useBrandManagementContext`. The hook uses `useSuspenseQuery(GET_BRANDS)` so the parent `<Suspense>` boundary renders the skeleton automatically on load/refetch. Mutations use `useMutation(UPDATE_BRAND_STATUS)`. State transitions (sort, page, filter) are wrapped in `startTransition` so the existing list stays visible while the new page loads (`isPending` drives the inline loading indicator).

### Context Exposed Values

| Key                            | Type                   | Description                                                                                    |
| ------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `brandList`                    | `BrandType[]`          | Current page of brands                                                                         |
| `brandData`                    | `ListBrandsData`       | Stats: `totalBrands`, `activeBrands`, `inactiveBrands`                                         |
| `paginationInfo`               | `PaginationInfo`       | `totalPages`, `totalCount`                                                                     |
| `sorting` / `setSorting`       | TanStack state         | Controlled sort state                                                                          |
| `pagination` / `setPagination` | TanStack state         | Controlled pagination state                                                                    |
| `filterState`                  | `{ search, status }`   | Current filter values                                                                          |
| `ALL_STATUSES`                 | `string` (`'__ALL__'`) | Sentinel value for "show all"                                                                  |
| `updateSearch`                 | `fn`                   | Updates search string (debounced)                                                              |
| `clearSearch`                  | `fn`                   | Clears search instantly (bypasses debounce)                                                    |
| `updateStatus`                 | `fn`                   | Updates status filter                                                                          |
| `resetFilters`                 | `fn`                   | Resets to defaults (`search: ''`, `status: 'true'`)                                            |
| `loading`                      | `boolean`              | `isPending` from `useTransition`                                                               |
| `isUpdatingStatus`             | `boolean`              | Mutation in-flight flag                                                                        |
| `handleActivateBrand`          | `fn`                   | Calls `UPDATE_BRAND_STATUS` with `isActive: true`                                              |
| `handleDeactivateBrand`        | `fn`                   | Calls `UPDATE_BRAND_STATUS` with `isActive: false`; returns `IncompleteCampaignType[] \| null` |
| `handleCreateBrand`            | `fn`                   | Alias for `refetchBrands`                                                                      |
| `handleUpdateBrand`            | `fn`                   | Alias for `refetchBrands`                                                                      |

## Accessibility

The module follows WCAG 2.2 AA guidelines:

- All decorative icons use `aria-hidden="true"`; buttons have explicit `aria-label` or tooltip text for accessible names.
- The status filter `<Select>` has an explicit `aria-label` (WCAG 1.3.1).
- Table headers use `aria-sort` for sorted columns.
- `SectionErrorBoundary` wraps both the stat cards section and the brand table to contain failures gracefully.
- Loading skeletons are used in place of spinners to minimise layout shift.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
