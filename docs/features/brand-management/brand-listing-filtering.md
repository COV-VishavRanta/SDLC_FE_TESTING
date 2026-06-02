# Brand Listing and Filtering

The Brand Listing and Filtering feature manages how brand records are displayed, paginated, and filtered on the Brand Management page (`src/app/(protected)/brand-management/page.tsx`).

## Components

### BrandTable

Located: `src/app/(protected)/brand-management/(components)/brand-table/brand-table.tsx`

The `BrandTable` component displays the brand list in a paginated table format. It consumes data and state from the `BrandManagementContext`.

**Key Features:**

- **Data Rendering**: Uses `@tanstack/react-table` with data fetched via Apollo Client.
- **Sorting**: Columns can be sorted via headers.
- **Pagination**: Supports pagination with page size and current page controls.
- **Loading State**: Displays a loading skeleton (`BrandTableSkeleton` & `BrandTableInlineLoading`) while data fetches.
- **Accessibility**: Includes ARIA captions, headers, row count announcements, and screen reader labels.

### BrandFilters

Located: `src/app/(protected)/brand-management/(components)/brand-filters/brand-filters.tsx`

Allows users to refine the brand list based on criteria.

**Filter Controls:**

- **Search**: `PageSearch` input bound to `filterState.search`. Calls `updateSearch` on change and `clearSearch` on clear.
- **Status Filter**: `Select` dropdown with three options:

| Option label | Value stored                   | `isActive` sent to API |
| ------------ | ------------------------------ | ---------------------- |
| All          | `'__ALL__'` (= `ALL_STATUSES`) | omitted (`undefined`)  |
| Active       | `'true'`                       | `true`                 |
| Inactive     | `'false'`                      | `false`                |

Default value is `'true'` (Active). Labels are fully internationalised via `brandManagement.statusOptions` locale keys.

- **Reset**: `PageResetButton` calls `resetFilters`, returning the status filter to `'true'` (Active) and clearing the search.

## Data Flow (State Management)

The `BrandManagementContext` (via `useBrandManagementContext`) manages the following state:

- `brandList`: The array of brand objects currently displayed.
- `brandData`: Raw `listBrands` response — also contains `totalBrands`, `activeBrands`, `inactiveBrands` consumed by `BrandStatCards`.
- `paginationInfo`: Metadata for total pages and total count.
- `sorting`: Current sorting configuration (TanStack `SortingState`).
- `pagination`: Current page and page size (TanStack `PaginationState`).
- `filterState`: `{ search: string; status: string }` — status defaults to `'true'` (Active only).
- `ALL_STATUSES`: Sentinel constant `'__ALL__'` used as the "show all" option value.
- `loading`: Derived from `useTransition`'s `isPending` — `true` while a sort/page/filter change is in flight. Keeps the stale list visible instead of showing a full skeleton.

**Handlers:**

- `setSorting`: Updates sort state — wrapped in `startTransition`.
- `setPagination`: Updates pagination state — wrapped in `startTransition`.
- `updateSearch`: Updates `filterState.search`. The debounce effect commits `activeSearch` after `SEARCH_DEBOUNCE_MS` ms, then resets `pageIndex` to 0.
- `clearSearch`: Immediately clears both `filterState.search` and `activeSearch`, bypassing the debounce via a `skipDebounceRef` flag.
- `updateStatus`: Updates `filterState.status` and resets `pageIndex` to 0.
- `resetFilters`: Resets `filterState` to `{ search: '', status: 'true' }` (Active-only) and resets `pageIndex` to 0. Does **not** clear the search input instantly — use `clearSearch` for that.

## Implementation Details

The table is configured with `manualSorting: true` and `manualPagination: true`, meaning sorting and pagination logic are handled server-side (via GraphQL query variables), not client-side. The component only manages the UI state and passes changes to the context via `setSorting` / `setPagination`.

GraphQL variables are derived reactively via `useMemo`. The query uses `fetchPolicy: 'network-only'` to always reflect the latest server state. `useSuspenseQuery` is used so the parent `<Suspense>` boundary renders `BrandTableSkeleton` on the initial load automatically.

## Accessibility Considerations

- **Live Regions**: The `BrandTableInlineLoading` overlay uses `aria-live` to announce loading states without hiding the stale content.
- **Table Headers**: Rendered with `aria-sort` via `getAriaSort()` utility.
- **Form Controls**: The status `<Select>` carries an explicit `aria-label` (WCAG 1.3.1). The search input uses a placeholder.
- **Table Caption**: `<TableCaption>` is always present for screen readers.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
