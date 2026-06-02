# Store Listing and Filtering

The Store Listing and Filtering feature manages how store records are displayed, paginated, and filtered on the Store Management page (`src/app/(protected)/store-management/page.tsx`).

## Components

### StoreTable

Located: `src/app/(protected)/store-management/(components)/store-table/store-table.tsx`

The `StoreTable` component displays the store list in a paginated table format. It consumes data and state from the `StoreManagementContext`.

**Key Features:**

- **Data Rendering**: Uses `@tanstack/react-table` with data fetched via Apollo Client.
- **Sorting**: Columns can be sorted via headers (Name, Store Number, Created Date).
- **Pagination**: Supports pagination with page size and current page controls.
- **Loading State**: Displays a loading skeleton (`StoreTableSkeleton` & `StoreTableInlineLoading`) while data fetches.
- **Accessibility**: Includes ARIA captions, headers, row count announcements, and screen reader labels.

### StoreFilters

Located: `src/app/(protected)/store-management/(components)/store-filters/store-filters.tsx`

Allows users to refine the store list based on criteria.

**Filter Controls:**

- **Search**: Input field for searching by store name or related keywords (`search` variable). Debounced updates.
- **Status Filter**: Dropdown to filter stores by status. Options: **All** (no filter sent to API), **Active** (`true`), **Inactive** (`false`). Defaults to Active. Selecting "All" omits the `isActive` field from the GraphQL filter.

### StoreStats

Located: `src/app/(protected)/store-management/(components)/store-stats/store-stats.tsx`

Displays statistical overview cards pulling `storeOverviewData` from the context:

- **Total Stores**: Count of all stores.
- **Active Stores**: Count of currently active stores.
- **Inactive Stores**: Count of currently inactive stores.

## Data Flow (State Management)

The `StoreManagementContext` manages the following state:

- `storeList`: The array of Store objects currently displayed.
- `paginationInfo`: Metadata for total pages and total count.
- `storeOverviewData`: Object containing `totalStores`, `activeStores`, and `inactiveStores`.
- `sorting`: Current sorting configuration (column ID and direction).
- `pagination`: Current page and page size.
- `filterState`: Objects containing search query and status filter (`'' | 'true' | 'false'`).

**Handlers:**

- `setSorting`: Updates sort state and triggers a re-fetch.
- `setPagination`: Updates pagination state and triggers a re-fetch.
- `updateSearch`: Updates search filter state.
- `updateStatus`: Updates status filter state. Accepts `'' | 'true' | 'false'`. An empty string means "All" — `isActive` is omitted from the API call.
- `resetFilters`: Clears all filters to default state.

## Implementation Details

The table is defined with `manualSorting: true` and `manualPagination: true`, meaning sorting and pagination logic are handled server-side (via GraphQL query variables), not client-side. The component only manages the UI state and passes changes to the context.

## Accessibility Considerations

- **Live Regions**: Uses `aria-live="polite"` to announce loading states.
- **Table Headers**: Defined with `scope="col"` and `aria-sort` attributes.
- **Form Controls**: Search input and select dropdowns have explicit `aria-label` or placeholder text for screen readers (e.g., `aria-label={t('filter.statusAriaLabel')}`).
- **Stat Cards**: Decorative icons are hidden (`aria-hidden="true"`), relying on card content for context.

## Data Flow Diagram

`mermaid
sequenceDiagram
    participant UI as User Interface
    participant Context as StoreManagementContext
    participant Apollo as Apollo Client
    participant Backend as FastAPI Backend

    UI->>Context: Change Filter/Sort/Page
    Context->>Context: Update State (debounced if search)
    Context->>Apollo: useSuspenseQuery(GET_STORES, vars)
    Apollo->>Backend: GraphQL Request
    Backend-->>Apollo: Stores & Pagination Data
    Apollo-->>Context: Update storeData
    Context-->>UI: Re-render Table/Stats
``n
---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
