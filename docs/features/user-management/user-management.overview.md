# User Management Module Overview

The User Management module allows administrators to manage platform users. This includes creating new users, editing existing ones, managing their status (active/inactive), resending invitations, and handling role-based permissions for user visibility and creation.

## Architecture

The module is built using the Next.js App Router and located at `src/app/(protected)/user-management`. It uses a Context API pattern (`UserManagementContext`) to manage global state such as the user list, filter state, and pagination info.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  UserManagementPage (RSC — app/(protected)/user-management) │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  UserManagementProvider (Client Context)              │  │
│  │                                                       │  │
│  │   ┌──────────────┐    ┌──────────────┐                │  │
│  │   │ UserFilters  │    │  UserTable   │                │  │
│  │   │   (Client)   │    │   (Client)   │                │  │
│  │   └──────┬───────┘    └──────┬───────┘                │  │
│  │          │                   │                        │  │
│  │          └───────────┬───────┘                        │  │
│  │            UserManagementContext                      │  │
│  │     (State + Apollo SuspenseQuery / Mutations)        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
             ┌────────────────────────┐
             │  Apollo Client (RSC)   │
             │     GET_USERS GQL      │
             └────────────────────────┘
                          │
                          ▼
             ┌────────────────────────┐
             │   FastAPI Backend      │
             │     (users query)      │
             └────────────────────────┘
```

### Directory Structure

- **Page Root**: `page.tsx` - Orchestrates the main layout, injecting the `UserManagementProvider`.
- **Context**: `context/UserManagementContext.tsx` - Provides state, handlers, and permission logic.
- **Components**:
  - `(components)/user-filters/`: Permission-gated filtering components.
  - `(components)/user-table/`: Data table for listing users.
  - `(components)/create-user-button/`: Trigger for the creation workflow.
- **Dialogs**:
  - `components/dialog/user-dialog/`: Shared dialog for creating and editing users (used here and in PSP creation).
  - `(components)/activate-deactivate-user/`: Dialogs for status changes.
  - `(components)/delete-user/`: Dialog warning the user against deletion and recommending deactivation.
  - `(components)/resend-invitation-dialog/`: Dialog for resending invites.
  - `(components)/impersonate-user/`: Dialog/logic for impersonation (Platform Admin only).

## Key Features

1.  [**Listing & Filtering**](./user-listing-filtering.md): View users with permission-based scoping and filtering.
2.  [**Creation & Editing**](./user-creation-editing.md): Create and edit users with complex role/entity logic (shared dialog). Supports all admin tiers: Platform Admin, PSP Admin, and Brand Admin (with store assignment for Store Admin and Regional Manager roles).
3.  [**Activation & Deactivation**](./user-activation.md): Manage user status, including impersonation and resending invites.

## Data Fetching

Data is fetched via GraphQL query `listUsers` (Apollo Client). The `UserManagementProvider` handles the data fetching and permission logic (deriving `isPlatformAdmin`, `isPspAdmin`, etc. from the session cookie).

## Accessibility

The module follows WCAG 2.1 guidelines, ensuring:

- Proper ARIA labels for tables and form controls.
- Keyboard navigation support.
- Screen reader announcements for loading states and filter changes.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
