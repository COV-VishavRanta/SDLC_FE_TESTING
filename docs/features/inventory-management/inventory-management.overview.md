# Inventory Management Architecture

## Overview

The Inventory Management feature provides a full CRUD system for managing product inventory items within Pop Logic. It follows a Backend for Frontend (BFF) pattern using Next.js 16 Server Components for initial structure, Client Components for interactivity, and Apollo Client for GraphQL data fetching and state management.

## Status

Implemented

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  InventoryManagementPage (RSC — app/(protected)/inventory-management)       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  InventoryManagementProvider (Client Context)                         │  │
│  │                                                                       │  │
│  │   ┌──────────────────┐    ┌──────────────────┐                        │  │
│  │   │ CreateInventory  │    │ Inventory        │                        │  │
│  │   │ Button (Client)  │    │ Filters (Client) │                        │  │
│  │   └────────┬─────────┘    └──────┬───────────┘                        │  │
│  │            │                     │                                    │  │
│  │            └──────────┬──────────┘                                    │  │
│  │                       ▼                                               │  │
│  │           useInventoryManagementContext                               │  │
│  │         (useSuspenseQuery: LIST_INVENTORY, GET_BRANDS)               │  │
│  │                       │                                               │  │
│  │   ┌───────────────────────────────────────────────────────────────┐   │  │
│  │   │  SectionErrorBoundary                                         │   │  │
│  │   │   ┌──────────────────────────────────────────────────────┐    │   │  │
│  │   │   │  <Suspense fallback=<InventoryTableSkeleton>>        │    │   │  │
│  │   │   │    InventoryTable (Client)                           │    │   │  │
│  │   │   │      InventoryActionCell (view / edit / delete)      │    │   │  │
│  │   │   └──────────────────────────────────────────────────────┘    │   │  │
│  │   └───────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                      ┌──────────────────────────────────────┐
                      │         Apollo Client (browser)      │
                      │  LIST_INVENTORY / GET_BRANDS queries │
                      │  CREATE / UPDATE / DELETE mutations  │
                      └──────────────────────────────────────┘
```

## Key Concepts

| Concept                           | Description                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **InventoryManagementContext**    | Provides centralized state for filter selections, pagination, sorting, brand list, and data to all inventory components. Seeded with `selectedPspId` from `useGlobalProtected`.                                                                                                                               |
| **useInventoryManagementContext** | Hook managing TanStack React Table state, debounce logic for search inputs, and `useSuspenseQuery` calls for `LIST_INVENTORY` and `GET_BRANDS`. Mutations (create/update/delete) are handled inside their respective dialog components, not here. Also exposes `refetchInventory` for programmatic refetches. |
| **SectionErrorBoundary**          | Wraps the `<Suspense>`-gated `InventoryTable` to gracefully render an error UI if the `LIST_INVENTORY` query throws.                                                                                                                                                                                          |
| **Two-Step Upload**               | Process for inventory imagery: first calls `GENERATE_INVENTORY_UPLOAD_URL` mutation to obtain a presigned S3 PUT URL + `fileKey`, then pipes the binary through `uploadFileToS3` server action.                                                                                                               |
| **Capability-Gated Actions**      | `InventoryActionCell` and `CreateInventoryButton` use `useCapabilities(INVENTORY_CAPABILITIES_MAP, DEFAULT_INVENTORY_CAPABILITIES)` to conditionally render view, edit, delete, and create controls based on the current user's permissions.                                                                  |
| **Active Campaign Lock**          | When `inventory.inActiveCampaign === true`, the edit and delete actions are hidden and replaced by an `InfoCircleIcon` tooltip explaining the item is read-only while tied to an active campaign.                                                                                                             |

## Implementation Details

The module leverages a tightly coupled set of components wrapped in a Context Provider:

- **Filtering & Search**: Driven by debounced inputs (`useDebounce` from `@uidotdev/usehooks`) directly controlling reactive state to trigger `useSuspenseQuery` re-fetches. A `skipDebounceRef` flag allows the "Clear" action to bypass debounce and reset instantly.
- **Server-Side Pagination/Sorting**: `InventoryTable` uses `manualSorting: true` and `manualPagination: true` via TanStack React Table, delegating all ordering and slicing to the backend. Currently, only `name → InventorySortField.NAME` is wired in the column sort map.
- **State Transitioning**: All filter, sort, and pagination state updates are wrapped in `startTransition`, causing `loading: isPending` to be `true` during refetches, which drives skeleton overlays and `aria-busy` on the table.
- **CRUD Modals**: Dialogs for create (`InventoryDialog mode='create'`), edit (`InventoryDialog mode='edit'`), view (`ViewInventoryDialog`), and delete (`DeleteInventoryDialog`) are conditionally rendered inline in the table action cell. Each write operation calls `refetchQueries: ['ListInventory']` on success.
- **Error Boundary**: A `<SectionErrorBoundary>` with translated title/description wraps the `<Suspense>` block containing `InventoryTable`, surfacing a user-friendly fallback if the query rejects.

## Current Implementation

- **Table View**: Paginated list of inventory items (`name`, `brandId`, `quantity`, `actions` columns). Only `name` column is sortable (ascending/descending).
- **Create Flow**: `InventoryDialog mode='create'` — capability-gated (`canCreateInventory`). Validated fields: name, brand, width, height, material, specifications, description, available quantity, and a required image upload via `useInventoryUpload`.
- **Edit Flow**: `InventoryDialog mode='edit'` — capability-gated (`canEditInventory`) and blocked when `isInActiveCampaign`. Pre-filled via `initialData`. Tracks `imagesToAdd` / `imagesToRemove` deltas for partial image updates. Image is optional if an existing image remains.
- **View Mode**: `ViewInventoryDialog` — capability-gated (`canViewInventory`). Read-only display of all item fields including the primary image (first image with `isPrimary`, or the first image in the list) and `createdAt` date. Has a `ViewInventoryDialogSkeleton` loading state.
- **Delete Flow**: `DeleteInventoryDialog` — capability-gated (`canDeleteInventory`) and blocked when `isInActiveCampaign`. Confirmation-gated modal executing the `DELETE_INVENTORY` mutation.
- **Loading States**: Full-page skeleton (`loading.tsx`), inline table skeleton (`InventoryTableSkeleton`), and view dialog skeleton (`ViewInventoryDialogSkeleton`).

## Security Considerations

- Image upload avoids exposing sensitive tokens to the browser by using server actions (`uploadFileToS3`) to pipe backend-provided S3 presigned URLs.
- GraphQL queries rely on `pspId` from the `GlobalProtectedContext` for strictly localized tenant segmentation (authorization). Do not query records without supplying rigorous `pspId` binding.
- Client-side validation uses robust Zod schemas ensuring clean data structure checks before network transition.

## Related Documentation

- [Inventory CRUD Operations](inventory-crud-flow.md)
- [Inventory Listing & Filtering](inventory-listing-filtering.md)

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
