# PSP Listing and Filtering

The PSP Listing and Filtering feature manages how PSP records are displayed, paginated, and filtered on the PSP Management page (`src/app/(protected)/psp-management/page.tsx`).

## Components

### PspTable

Located: `src/app/(protected)/psp-management/(components)/psp-listing/psp-table.tsx`

The `PspTable` component displays the PSP list in a paginated table format. It consumes data and state from the `PspManagementContext`.

**Key Features:**

- **Data Rendering**: Uses `@tanstack/react-table` with data fetched via Apollo Client using `useSuspenseQuery`.
- **Sorting**: Columns can be sorted via headers.
- **Pagination**: Supports pagination with page size and current page controls.
- **Loading State**: Displays a loading skeleton (`PspTableSkeleton` & `PspTableInlineLoading`) while data fetches.
- **Accessibility**: Includes ARIA captions, headers, row count announcements, and screen reader labels.

### PspFilter

Located: `src/app/(protected)/psp-management/(components)/psp-filter/psp-filter.tsx`

Allows users to refine the PSP list based on criteria.

**Filter Controls:**

- **Search**: Input field for searching by PSP name or related keywords. Debounced updates (300ms typical) using `@uidotdev/usehooks` debounce, with an instant clear option.
- **Status Filter**: Dropdown to filter PSPs by status. Options: **All** (represented by `ALL_STATUSES` constant), **Active** (`'true'`), **Inactive** (`'false'`). Defaults to Active. Selecting "All" omits the `isActive` field from the GraphQL filter.
- **Clear Actions**: Supports clearing the search instantly alongside a complete reset of status filters.

### StatSection

Located: `src/app/(protected)/psp-management/(components)/stat-section/stat-section.tsx`

Displays statistical overview cards pulling `pspOverviewData` from the context:

- **Total PSPs**: Count of all PSPs.
- **Active PSPs**: Count of currently active PSPs.
- **Inactive PSPs**: Count of currently inactive PSPs.

## Data Flow (State Management)

The `PspManagementContext` manages the following state:

- `pspList`: The array of PSP objects currently displayed.
- `paginationInfo`: Metadata for total pages and total count.
- `pspData`: Overall data structure including pagination, pspList, and stats.
- `sorting`: Current sorting configuration (column ID and direction). Note: sorted fields mapped via `COLUMN_SORT_MAP`.
- `pagination`: Current page and page size.
- `filterState`: Objects containing search query and status filter (`'true' | 'false' | '__ALL__'`).
- `activeSearch`: Separated active search (debounced vs raw input).
- Transitions: Uses `React.useTransition` for smooth loading when filters/sorts change.

**Handlers:**

- `setSorting`: Updates sort state and triggers a re-fetch.
- `setPagination`: Updates pagination state and triggers a re-fetch.
- `updateSearch`: Updates search filter state.
- `clearSearch`: Instantly clears search bypassing debouncer and resetting page index.
- `resetFilters`: Resets filter states except search and rests page index.
- `updateStatus`: Updates status filter state and triggers a re-fetch, resetting page index.

## Implementation Details

The table is defined with `manualSorting: true` and `manualPagination: true`, meaning sorting and pagination logic are handled server-side (via GraphQL query variables), not client-side. The component only manages the UI state and passes changes to the context.

## Accessibility Considerations

- **Live Regions**: Uses `aria-live="polite"` to announce loading states.
- **Table Headers**: Defined with `scope="col"` and `aria-sort` attributes.
- **Form Controls**: Search input and select dropdowns have explicit `aria-label` or placeholder text for screen readers.
- **Stat Cards**: Decorative icons are hidden (`aria-hidden="true"`), relying on card content for context.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
