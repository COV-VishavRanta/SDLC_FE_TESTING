# PSP Management Module Overview

The PSP (Print Service Provider) Management module allows administrators to manage PSP entities within the system. This includes creating new PSPs, editing existing ones, activating/deactivating PSPs, and viewing a list of PSPs with filtering capabilities and statistical overviews.

## Architecture

The module is built using the Next.js App Router and located at `src/app/(protected)/psp-management`. It uses a Context API pattern (`PspManagementContext`) to manage global state such as the PSP list, filter state, pagination info, and statistics, avoiding prop drilling.

### Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  PspManagementPage (RSC — app/(protected)/psp-management)                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  PspManagementProvider (Client Context)                               │  │
│  │                                                                       │  │
│  │   ┌──────────────┐    ┌──────────────┐         ┌──────────────────┐   │  │
│  │   │  PspFilter   │    │   PspTable   │         │   StatSection    │   │  │
│  │   │   (Client)   │    │   (Client)   │         │     (Client)     │   │  │
│  │   └──────┬───────┘    └──────┬───────┘         └────────┬─────────┘   │  │
│  │          │                   │                          │             │  │
│  │          └───────────────────┴──────────┬───────────────┘             │  │
│  │                                         ▼                             │  │
│  │                                PspManagementContext                   │  │
│  │                     (State + Apollo SuspenseQuery / Mutations)        │  │
│  └─────────────────────────────────────────┬─────────────────────────────┘  │
└────────────────────────────────────────────┼────────────────────────────────┘
                                             │
                                             ▼
                                ┌────────────────────────┐
                                │  Apollo Client (RSC)   │
                                │     GET_PSPS GQL       │
                                └────────────┬───────────┘
                                             │
                                             ▼
                                ┌────────────────────────┐
                                │   FastAPI Backend      │
                                │     (psps query)       │
                                └────────────────────────┘
```

### Directory Structure

- **Page Root**: `page.tsx` - Orchestrates the main layout, including the header, stats, filters, and table.
- **Context**: `context/PspManagementContext.tsx` - Provides state and handlers for PSP operations.
- **Components**:
  - `(components)/psp-filter/`: Search and status filtering components.
  - `(components)/stat-section/`: Statistics summary cards (Total, Active, Inactive).
  - `(components)/psp-listing/`: Data table for listing PSPs.
  - `(components)/create-psp-button/`: Trigger for the creation workflow.
- **Dialogs**:
  - `components/dialog/psp-dialog/`: Reusable dialog for creating and editing PSPs.
  - `(components)/activate-deactivate-dialog/`: Dialogs for status changes.
  - `(components)/delete-psp/`: Dialog warning the user against deletion and recommending deactivation.
- **Details Page**: `[id]/` folder for displaying comprehensive details.

## Key Features

1.  [**Listing & Filtering**](./psp-listing-filtering.md): View PSPs with pagination, sorting, and filters (search, status). Includes a statistics section.
2.  [**Creation & Editing**](./psp-creation-editing.md): Create new PSPs (with subsequent admin user creation) and edit PSP details.
3.  [**Activation & Deactivation**](./psp-activation.md): Manage the active status of PSPs, including checks for incomplete campaigns during deactivation.
4.  [**Details View**](./psp-details.overview.md): Comprehensive read-only view of a PSP and its administrators.

## Data Fetching

Data is fetched via GraphQL queries and mutations (Apollo Client/RSC). The `PspManagementProvider` handles the data fetching logic using `useSuspenseQuery` and exposes the data to child components.

## Accessibility

The module follows WCAG 2.2 AA guidelines (detailed in `psp-management-508.architecture.md`), ensuring:

- Proper ARIA labels for interactive elements.
- Keyboard navigation support.
- Screen reader announcements for dynamic content changes (e.g., loading states).
- Error boundaries for graceful failure handling.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
