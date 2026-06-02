# Impersonation Feature

## Overview

The Impersonation feature allows privileged admin users to temporarily assume the identity of a lower-level user for support, debugging, or operational purposes. It is role-hierarchy scoped — each admin can only impersonate exactly one level below them. While impersonating, a fixed banner is displayed to signal the active session, and the admin can end it at any time.

---

## Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  ProtectedRootLayout (RSC — app/(protected)/layout.tsx)                      │
│                                                                              │
│  Reads IS_IMPERSONATING_COOKIE server-side → seeds initialIsImpersonating    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  GlobalProtectedProvider (Client Context)                              │  │
│  │                                                                        │  │
│  │  Runs:  useQuery(GET_IMPERSONATION_STATUS)                             │  │
│  │         useMutation(START_IMPERSONATION)                               │  │
│  │         useMutation(STOP_IMPERSONATION)                                │  │
│  │                                                                        │  │
│  │  Exposes: isImpersonating, impersonatedUser, impersonatorUser,         │  │
│  │           startImpersonation(), stopImpersonation(),                   │  │
│  │           isImpersonationLoading                                       │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────┐  ┌────────────────────────────────┐  │  │
│  │  │  ImpersonationBanner        │  │  User Management Page          │  │  │
│  │  │  (Client Component)         │  │  └─ UserTable                  │  │  │
│  │  │                             │  │     └─ ActionCell (Client)     │  │  │
│  │  │  Reads: isImpersonating     │  │        └─ ImpersonateUserDialog│  │  │
│  │  │  Calls: stopImpersonation() │  │           Calls:               │  │  │
│  │  │  Shows: role + entity name  │  │           startImpersonation() │  │  │
│  │  └─────────────────────────────┘  └────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
               ┌────────────────────────────────────┐
               │  Apollo Client (GraphQL / FastAPI)  │
               │                                    │
               │  GET_IMPERSONATION_STATUS (query)  │
               │  START_IMPERSONATION (mutation)    │
               │  STOP_IMPERSONATION  (mutation)    │
               └────────────────────────────────────┘
```

---

## Role Hierarchy & Permission Rules

Impersonation is strictly one level down in the role hierarchy:

| Acting Role      | Can Impersonate |
| ---------------- | --------------- |
| `PLATFORM_ADMIN` | `PSP_ADMIN`     |
| `PSP_ADMIN`      | `BRAND_ADMIN`   |
| `BRAND_ADMIN`    | `STORE_ADMIN`   |
| `STORE_ADMIN`    | _(none)_        |

Permission check is enforced client-side via `canImpersonate()` in [`src/lib/permissions/impersonation.permissions.ts`](../../../src/lib/permissions/impersonation.permissions.ts) and enforced server-side by the FastAPI backend.

Additional guard conditions before the **Impersonate** action button is shown:

- The current session must **not** already be impersonating.
- The target user must have status `ACTIVE`.

---

## Key Files

| File                                                                                                                                                                                                        | Role                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [`src/contexts/GlobalProtectedContext.tsx`](../../../src/contexts/GlobalProtectedContext.tsx)                                                                                                               | Context — holds all impersonation state and actions        |
| [`src/components/impersonation-banner/ImpersonationBanner.tsx`](../../../src/components/impersonation-banner/ImpersonationBanner.tsx)                                                                       | UI — fixed top banner shown during active session          |
| [`src/app/(protected)/user-management/(components)/impersonate-user/impersonate-user-dialog.tsx`](<../../../src/app/(protected)/user-management/(components)/impersonate-user/impersonate-user-dialog.tsx>) | UI — confirmation dialog before starting                   |
| [`src/app/(protected)/user-management/(components)/user-table/action-cell.tsx`](<../../../src/app/(protected)/user-management/(components)/user-table/action-cell.tsx>)                                     | UI — renders the Impersonate icon/button in the user table |
| [`src/lib/permissions/impersonation.permissions.ts`](../../../src/lib/permissions/impersonation.permissions.ts)                                                                                             | Logic — `canImpersonate()` role check                      |
| [`src/graphql/mutations/impersonation/impersonation.mutations.ts`](../../../src/graphql/mutations/impersonation/impersonation.mutations.ts)                                                                 | GraphQL — `START_IMPERSONATION`, `STOP_IMPERSONATION`      |
| [`src/graphql/mutations/impersonation/impersonation.types.ts`](../../../src/graphql/mutations/impersonation/impersonation.types.ts)                                                                         | Types — mutation inputs/responses                          |
| [`src/graphql/queries/impersonation/impersonation.queries.ts`](../../../src/graphql/queries/impersonation/impersonation.queries.ts)                                                                         | GraphQL — `GET_IMPERSONATION_STATUS`                       |
| [`src/graphql/queries/impersonation/impersonation.types.ts`](../../../src/graphql/queries/impersonation/impersonation.types.ts)                                                                             | Types — query response types                               |

---

## Sub-Feature Documentation

- [Impersonation Flow](./impersonation-flow.md) — Start/Stop lifecycle with state machine diagram

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
