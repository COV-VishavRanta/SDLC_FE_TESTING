# Store Management Module Overview

The Store Management module allows administrators to manage Store entities within the system. This includes creating new stores, editing existing ones, activating/deactivating stores, and viewing a list of stores with filtering capabilities and statistical overviews.

## Architecture

The module is built using the Next.js App Router and located at `src/app/(protected)/store-management`. It uses a Context API pattern (`StoreManagementContext`) to manage global state such as the store list, filter state, pagination info, and statistics, avoiding prop drilling.

### Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│  StoreManagementPage (RSC — app/(protected)/store-management)│
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  StoreManagementProvider (Client Context)             │  │
│  │                                                       │  │
│  │   ┌──────────────┐    ┌──────────────┐                │  │
│  │   │ StoreFilters │    │  StoreTable  │                │  │
│  │   │   (Client)   │    │   (Client)   │                │  │
│  │   └──────┬───────┘    └──────┬───────┘                │  │
│  │          │                   │                        │  │
│  │          └───────────┬───────┘                        │  │
│  │             StoreManagementContext                    │  │
│  │   (State + Apollo SuspenseQuery / Mutations)          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
             ┌────────────────────────┐
             │  Apollo Client (RSC)   │
             └────────────────────────┘
```

### Directory Structure

- **Page Root**: `page.tsx` - Orchestrates the main layout, including the header, stats, filters, and table.
- **Context**: `context/StoreManagementContext.tsx` - Provides state and handlers for store operations.
- **Components**:
  - `(components)/store-filters/`: Search and status filtering components.
  - `(components)/store-stats/`: Statistics summary cards (Total, Active, Inactive).
  - `(components)/store-table/`: Data table for listing stores.
  - `(components)/create-store-button/`: Trigger for the creation workflow.
- **Dialogs**:
  - `components/dialog/store-dialog/`: Reusable dialog for creating and editing stores.
  - `(components)/activate-deactivate-dialog/`: Dialogs for status changes.

## Key Features

1.  [**Listing & Filtering**](./store-listing-filtering.md): View stores with pagination, sorting, and filters (search, status). Includes a statistics section.
2.  [**Creation & Editing**](./store-creation-editing.md): Create new stores (with subsequent admin user creation) and edit store details.
3.  [**Activation & Deactivation**](./store-activation.md): Manage the active status of stores, including checks for incomplete orders during deactivation.

## Data Fetching

Data is fetched via GraphQL queries and mutations (Apollo Client). The `StoreManagementProvider` handles the data fetching logic and exposes the data to child components.

## Accessibility

The module follows WCAG 2.2 Level AA guidelines (see [508 Architecture](<../../../src/app/(protected)/store-management/store-management-508.architecture.md>)), ensuring:

- Proper ARIA labels for interactive elements.
- Keyboard navigation support.
- Screen reader announcements for dynamic content changes (e.g., loading states).
- Error boundaries for graceful failure handling.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
