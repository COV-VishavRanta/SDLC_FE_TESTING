# Audit Logs Architecture

## Overview

The Audit Logs feature provides a read-only view of system activity across the platform. Authorized users can browse, filter, and inspect change events recorded by the backend. A change-details dialog lets users view previous and updated values for any viewable log entry.

The page is designed to be **shared across all admin roles**. The active role context determines which roles appear in the filter dropdown — a user can only filter by roles that are assignable to them (with `REGIONAL_MANAGER` always excluded), preventing visibility into activity outside their permission scope.

## Status

Implemented

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  AuditLogsPage (RSC — app/(protected)/audit-logs)               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AuditLogProvider (Client Context)                      │    │
│  │                                                         │    │
│  │   ┌─────────────────────────────────────────────────┐   │    │
│  │   │  "Viewing As" Badge   (reads role cookie, RSC)  │   │    │
│  │   └─────────────────────────────────────────────────┘   │    │
│  │                                                         │    │
│  │   ┌────────────┐                                        │    │
│  │   │ LogFilters │  (Client — outside Suspense)           │    │
│  │   └─────┬──────┘                                        │    │
│  │         │                                               │    │
│  │   ┌─────▼───────────────────────────────────────────┐   │    │
│  │   │  SectionErrorBoundary                           │   │    │
│  │   │   └── <Suspense fallback={<LogTableLoading />}> │   │    │
│  │   │         └── LogListing (Client)                 │   │    │
│  │   └─────────────────────────────────────────────────┘   │    │
│  │                                                         │    │
│  │   AuditLogContext (Apollo useSuspenseQuery)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │   Apollo Client        │
               │   GET_AUDIT_LOGS GQL   │
               └────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │   FastAPI Backend      │
               │   (auditLogs query)    │
               └────────────────────────┘
```

## Key Concepts

| Concept                    | Description                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AuditLogProvider**       | Client context that owns all filter state and drives the Apollo query. Acts as the single source of truth for the entire page. Wraps both `LogFilters` and `LogListing`.                                                                          |
| **AuditLogContext**        | Context value returned by `useAuditLogContext`, exposing state, data, and handlers to all child components.                                                                                                                                       |
| **Assignable role filter** | Users may only filter logs by roles that are assignable to them. Roles are filtered from `allRoles` using `role.assignable` from `GlobalProtectedContext`, and `REGIONAL_MANAGER` is always explicitly excluded. Roles are sorted alphabetically. |
| **Shared admin page**      | A single page implementation is reused for all admin roles. The "Viewing As" badge is resolved server-side from the `USER_ROLE_COOKIE_NAME` cookie and rendered in the RSC page shell.                                                            |
| **Stale-UI transitions**   | Filter and pagination changes are wrapped in `useTransition` so the previous data remains visible while new data is loading, avoiding layout flicker.                                                                                             |
| **Debounced search**       | The search input uses `useDebounce` (via `@uidotdev/usehooks`) before committing to `activeSearch`, reducing unnecessary network requests.                                                                                                        |
| **Server-side pagination** | TanStack Table is configured for manual pagination (`manualPagination: true`). Page counts and row counts come directly from the API.                                                                                                             |
| **Change Details Dialog**  | Rendered for log entries where `entry.isViewable === true`. Shows the previous and updated values for the entry.                                                                                                                                  |

## Implementation Details

### Folder Structure

```
audit-logs/
├── loading.tsx                              # Route-level skeleton (Next.js streaming)
├── page.tsx                                 # RSC entry point + "Viewing As" badge
├── (components)/
│   ├── log-filters/
│   │   └── log-filters.tsx                  # Search + role dropdown + date range dropdown
│   └── log-listing/
│       ├── log-listing.tsx                  # TanStack Table + pagination
│       ├── log-table-columns.tsx            # Column definitions (hook)
│       └── log-table.loading.tsx            # Suspense fallback + inline row skeletons
└── context/
    ├── AuditLogContext.tsx                  # Provider wrapping useAuditLogContext
    └── useAuditLogContext.ts                # All filter/pagination/query state
```

### Page Structure (`page.tsx`)

The page is a **Server Component** that:

1. Reads the current role from the `USER_ROLE_COOKIE_NAME` cookie server-side and renders a "Viewing As" badge — no client-side role resolution needed for this UI element.
2. Mounts `AuditLogProvider` around the entire interactive area (filters + listing).
3. Renders `LogFilters` directly inside the provider, outside the `Suspense` boundary, so filter controls remain interactive during data fetches.
4. Wraps `LogListing` in a `SectionErrorBoundary` and a `<Suspense fallback={<LogTableLoading />}>` for graceful loading and error states.

The route-level `loading.tsx` provides a full-page skeleton during initial navigation (Next.js streaming).

### Context & State (`useAuditLogContext`)

All filter and pagination state is centralized in `useAuditLogContext` and provided via `AuditLogProvider`. The hook:

- Maintains `pagination` (page index + page size via TanStack `PaginationState`)
- Maintains `selectedRoleId` (`null` = all roles), `selectedDateRange` (default: `DateRangeEnum.TODAY`), and `search` / `activeSearch` (debounced)
- Derives GraphQL `variables` reactively with `useMemo`
- Fetches data with Apollo `useSuspenseQuery` using `fetchPolicy: 'network-only'`
- Resets `pageIndex` to `0` whenever a filter or search changes
- Captures `initialData` with `useRef` on first render (available to consumers as a stable snapshot)

Exposed context API:

| Key                     | Type / Shape            | Description                                            |
| ----------------------- | ----------------------- | ------------------------------------------------------ |
| `pagination`            | `PaginationState`       | Current page index and page size                       |
| `setPagination`         | handler                 | Wrapped in `useTransition`                             |
| `search`                | `string`                | Raw (unthrottled) search input value                   |
| `updateSearch`          | handler                 | Sets the raw search string                             |
| `clearSearch`           | handler                 | Instantly clears search bypassing the debounce         |
| `selectedRoleId`        | `string \| null`        | Currently selected role UUID (`null` = all roles)      |
| `handleRoleChange`      | handler                 | Sets role and resets to page 1                         |
| `selectedDateRange`     | `DateRangeEnum \| null` | Active date range filter (default: `TODAY`)            |
| `handleDateRangeChange` | handler                 | Sets date range and resets to page 1                   |
| `resetFilters`          | handler                 | Resets role + date range to defaults; preserves search |
| `initialData`           | `GetAuditLogsResponse`  | Snapshot of data from the first render                 |
| `loading`               | `boolean`               | `true` during `useTransition` updates                  |
| `logs`                  | `AuditLogType[]`        | Current page of log entries                            |
| `paginationInfo`        | pagination metadata     | `totalCount`, `totalPages`, `hasNextPage`, etc.        |

### Role-Based Filtering (Assignable Roles)

The role filter in `LogFilters` computes its options as:

```typescript
const allowedRoles = allRoles.filter(
  (role) => role.assignable && role.name !== UserRole.REGIONAL_MANAGER,
);
const sortedAllowedRoles = [...allowedRoles].sort((a, b) => a.name.localeCompare(b.name));
```

- Only `assignable: true` roles from `GlobalProtectedContext` are included
- `REGIONAL_MANAGER` is always excluded regardless of `assignable` status
- The resulting list is sorted alphabetically by name before rendering

The GraphQL query sends `filter.roleIds: [selectedRoleId]` for the selected role, or omits `roleIds` entirely when "All Roles" is selected.

### GraphQL Query (`GET_AUDIT_LOGS`)

```
auditLogs(page, pageSize, filter: AuditFilterInput)
  └── success, message
  └── logs[]
      ├── id, pspId, actorUserId, actorDisplayName, actorEmail, action
      ├── entityType, entityId, entityName
      ├── oldValue, newValue (JSON strings), isViewable
      ├── ipAddress, userAgent, createdAt
      └── actorRoles[] { id, name, description }
  └── pagination { totalCount, page, pageSize, totalPages, hasNextPage, hasPreviousPage }
```

Available filter inputs:

| Field       | Type            | Description                                                                |
| ----------- | --------------- | -------------------------------------------------------------------------- |
| `search`    | `string`        | Free-text search (debounced, 400 ms)                                       |
| `roleIds`   | `string[]`      | Filter by one or more role UUIDs                                           |
| `pspIds`    | `string[]`      | Filter by one or more PSP UUIDs (reserved for future use)                  |
| `dateRange` | `DateRangeEnum` | One of: `ALL_TIME`, `TODAY`, `LAST_7_DAYS`, `LAST_30_DAYS`, `LAST_90_DAYS` |

### Log Table Columns

| Column      | Source field                      | Notes                                                             |
| ----------- | --------------------------------- | ----------------------------------------------------------------- |
| User        | `actorDisplayName` + `actorEmail` | Display name (primary) with email shown below in smaller text     |
| Role        | `actorRoles[0].name`              | Primary role of the actor, i18n'd via `getRoleLabel`              |
| Action      | `action`                          | i18n'd via `getAuditActionLabel` utility                          |
| Entity Name | `entityName`                      | Name of the affected entity (e.g. brand or campaign name)         |
| Timestamp   | `createdAt`                       | Formatted via `formatTimestamp` utility                           |
| System Area | `entityType`                      | Rendered as a green `Badge`, i18n'd via `getAuditEntityTypeLabel` |
| Details     | `isViewable`                      | Eye button rendered only when `entry.isViewable === true`         |

### Change Details Dialog

The `ChangeDetailsDialog` component is rendered in the `details` column cell when `entry.isViewable === true`. It shows a modal with the entry's previous and updated values.

The `isViewable` flag is set by the backend — the frontend does not inspect `oldValue`/`newValue` or the `action` string to determine visibility.

### Internationalization (i18n)

The Audit Logs feature is fully internationalized using `next-intl`.

- **Server Components:** `page.tsx` uses `getTranslations('auditLogs')` and `getTranslations('roles')` for page metadata, page titles, and the "Viewing As" badge label.
- **Client Components:** `LogListing` and `LogFilters` use `useTranslations('auditLogs')` for table headers, empty states, filter labels, and `aria-live` announcements. Action labels and entity type labels each have dedicated translation namespaces (`auditLogs.actionLabels`, `auditLogs.entityTypeLabels`).

### Loading States

| Scope                          | Mechanism                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Full page (initial navigation) | `loading.tsx` skeleton via Next.js route segment                                           |
| Log table (initial data fetch) | `<Suspense fallback={<LogTableLoading />}>` wrapping `LogListing`                          |
| Filter/pagination transitions  | `useTransition` — inline row skeletons overlay the stale table via `LogTableInlineLoading` |

## Current Implementation

- Full server-side paginated log listing with TanStack Table
- Role filter (assignable roles only, `REGIONAL_MANAGER` excluded, sorted alphabetically), date-range filter (default: `TODAY`), and debounced search
- `resetFilters` handler to restore defaults without clearing the search input
- Change Details Dialog for entries where `isViewable === true`
- Route-level and inline loading skeletons
- i18n support via `next-intl` for all user-facing strings including action and entity type labels
- Error boundary (`SectionErrorBoundary`) around the log listing section
- "Viewing As" badge resolved server-side from the role cookie

## Security Considerations

- Role filter is restricted client-side to `assignable` roles (excluding `REGIONAL_MANAGER`) from the global context. Backend should also enforce role-scoped visibility on the `auditLogs` query.
- No mutation operations exist on this page — it is strictly read-only.
- The `ipAddress` and `userAgent` fields are fetched but currently not displayed in the table, limiting PII exposure in the default view.

## Related Documentation

- [GraphQL & Apollo Instructions](../../../.github/instructions/graphql-apollo.instructions.md)
- [Next.js Instructions](../../../.github/instructions/nextjs.instructions.md)
- [Access Control Architecture](../access-control/access-control.architecture.md)
- [User Management Architecture](../user-management/user-creation.architecture.md)

---

Last Update:- 05/11/2026
Agent name:- GitHub Copilot
Author:- Vishav Ranta
