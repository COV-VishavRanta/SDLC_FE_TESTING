# Alerts & Notifications Feature

The Alerts feature in the Pop Logic frontend application surfaces timely notification updates related to a user's Brand, PSP, or Store. Depending on the user's assigned role, alerts are strictly scoped to the underlying `selectedBrandId`, `selectedPspId`, or `selectedStoreId`.

The feature is exposed through three primary touchpoints:

1. **Dedicated Alerts Page** (`/alerts`) – A comprehensive view displaying all historical notifications with pagination and search functionalities.
2. **Dashboard Alerts Section** – A summarized widget on the main dashboard displaying the 3 most recent alerts.
3. **Topbar Notification Dropdown** – A globally available dropdown menu allowing users to quickly see new and unread notifications from any authenticated page.

## Architecture

The Alerts feature operates purely through `Apollo Client`, fetching data via the `GET_NOTIFICATIONS` GraphQL query. All three interactive touchpoints query the same endpoint but configure `page`, `pageSize`, and `search` variables differently.

```
┌───────────────────────────────────────────────────────────────────┐
│                      Alerts Ecosystem Overview                    │
│                                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │ Topbar Dropdown  │ │ Dashboard Section│ │   Alerts Page    │  │
│  │ (Client          │ │ (Client          │ │ (RSC Layout +    │  │
│  │  useLazyQuery)   │ │  useSuspenseQuery│ │  Client Context) │  │
│  └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘  │
│           │                   │                     │            │
│           ▼                   ▼                     ▼            │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │            Apollo Client (GET_NOTIFICATIONS GraphQL)         │ │
│  │    Scoped by: brandId | pspId | storeId  (role-dependent)   │ │
│  └─────────────────────────────┬────────────────────────────────┘ │
│                                │                                  │
└────────────────────────────────┼──────────────────────────────────┘
                                 ▼
                  ┌─────────────────────────────┐
                  │   Backend (Notifications API)│
                  └─────────────────────────────┘
```

## Folder Structure & Responsibilities

### Alerts Page (`src/app/(protected)/alerts/...`)

```
alerts/
├── loading.tsx                          # Route-level skeleton (Next.js streaming)
├── page.tsx                             # RSC entry point
├── (components)/
│   └── alerts-list/
│       ├── alerts-list.tsx              # Client list + search + pagination
│       └── alerts-list.loading.tsx      # Suspense fallback skeleton
└── context/
    ├── AlertsContext.tsx                # Provider + role resolution
    └── useAlertsContext.ts              # Apollo query + pagination + search state
```

- **`loading.tsx` (RSC Skeleton):** Next.js route-level loading UI shown during the initial page navigation. Renders the page header skeleton and delegates to `AlertsListSkeleton`.
- **`page.tsx` (RSC):** Entry point. Renders the page header and wraps `AlertsList` in both a `SectionErrorBoundary` (error UI) and a `Suspense` boundary (skeleton fallback). Handles `generateMetadata` for accessible page titles (WCAG 2.4.2).
- **`AlertsProvider` / `useAlertsContext.ts`:** Manages client-side state for the full alerts list. Resolves the active entity scope (`brandId`, `pspId`, or `storeId`) based on role, then drives `useSuspenseQuery`. Exposes pagination state (via `useTransition` for non-blocking updates), debounced search (`useDebounce`), and a `clearSearch` helper that bypasses the debounce timer.
- **`AlertsList`:** Uses `TanStack Table` as a headless driver purely for server-side pagination control. Renders rows as cards via the shared `AlertRow` component. Includes an `aria-live` region for screen-reader announcements during loading transitions (WCAG 4.1.3).

### Topbar Notifications (`src/components/app-topbar/notification-dropdown.tsx`)

- Uses **`useLazyQuery`** — notifications are fetched only when the dropdown is opened, ensuring fresh data on each interaction (`fetchPolicy: 'network-only'`).
- Fetches the last **5** notifications scoped to the active entity.
- Displays a red dot indicator on the bell icon if any fetched notification has `isRead: false`.
- Renders a loading skeleton while the query is in flight.
- Includes a "View all" link to the `/alerts` page.

### Dashboard Alerts Section (`src/app/(protected)/dashboard/(components)/alerts-section/alerts-section.tsx`)

- Uses **`useSuspenseQuery`** with `skipToken` to skip the query when no entity ID is resolved.
- Fetches the **top 3** latest alerts and renders them as `AlertRow` cards inside a `Card` widget.
- Shows a `NoRecordFound` empty state when there are no notifications.
- Includes a "View all" link to the `/alerts` page.

## Role-Based Fetching Context

Notification retrieval dynamically binds to the active selection state injected via `useGlobalProtected`. The entity scope is determined at query time using three predefined role sets:

| Role Set    | Constant                   | Bound Entity                  |
| ----------- | -------------------------- | ----------------------------- |
| PSP roles   | `PSP_NOTIFICATION_ROLES`   | `selectedPspId` → `pspId`     |
| Brand roles | `BRAND_NOTIFICATION_ROLES` | `selectedBrandId` → `brandId` |
| Store roles | `STORE_NOTIFICATION_ROLES` | `selectedStoreId` → `storeId` |

```typescript
// 1. Resolve role boundaries
const { role } = usePermissions();
const isPspRole = PSP_NOTIFICATION_ROLES.has(role as never);
const isBrandRole = BRAND_NOTIFICATION_ROLES.has(role as never);
const isStoreRole = STORE_NOTIFICATION_ROLES.has(role as never);

// 2. Identify contextual entity ID
const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();
const entityId = isPspRole
  ? selectedPspId
  : isBrandRole
    ? selectedBrandId
    : isStoreRole
      ? selectedStoreId
      : undefined;

// 3. Query execution — skipped entirely if no entityId is resolved
useSuspenseQuery(
  GET_NOTIFICATIONS,
  entityId
    ? {
        variables: {
          ...(isPspRole ? { pspId: selectedPspId } : {}),
          ...(isBrandRole ? { brandId: selectedBrandId } : {}),
          ...(isStoreRole ? { storeId: selectedStoreId } : {}),
        },
      }
    : skipToken,
);
```

If none of the role sets match the user's current role, `entityId` resolves to `undefined` and the query is skipped via `skipToken` — preventing unnecessary network requests.

---

Last Update:- 05/11/2026
Agent name:- GitHub Copilot
Author:- Vishav Ranta
