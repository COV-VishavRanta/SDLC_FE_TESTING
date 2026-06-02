# Webhook Management Architecture

**Feature Path**: `src/app/(protected)/webhooks`

The Webhook Management feature provides an interface for users (primarily PSP Admins and Platform Admins) to manage their webhook credentials. PSP Admins can create, activate, deactivate, and rotate webhook secrets, while Platform Admins have read-only visibility across all PSPs.

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  WebhookPage (RSC — /webhooks)                                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  WebhookProvider (Client Context)                                     │  │
│  │                                                                       │  │
│  │   ┌──────────────────┐    ┌─────────────────┐    ┌────────────────┐   │  │
│  │   │ WebhookPageHeader│    │ WebhookFilters  │    │ WebhookTable   │   │  │
│  │   │  (Create Action) │    │  (Status/Search)│    │ (Pagination/   │   │  │
│  │   └───────┬──────────┘    └────────┬────────┘    │  Sorting)      │   │  │
│  │           │                        │             └───────┬────────┘   │  │
│  │           └────────────────────────┼─────────────────────┘            │  │
│  │                                    ▼                                  │  │
│  │                            WebhookContext                             │  │
│  │             (State + Apollo useSuspenseQuery / Mutations)             │  │
│  └────────────────────────────────────┬──────────────────────────────────┘  │
│                                       │                                     │
│  ┌────────────────────────────────────▼──────────────────────────────────┐  │
│  │  WebhookDetailsPage (RSC — /webhooks/[encodedWebhookId])              │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  WebhookDetailsView (Client)                                    │  │  │
│  │  │   - Fetches single Webhook via GET_WEBHOOK_CREDENTIAL           │  │  │
│  │  │   - RotateSecretDialog (ROTATE_WEBHOOK_SECRET)                  │  │  │
│  │  │   - WebhookDialog (Shared, for editing)                         │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
                           ┌────────────────────────┐
                           │  Apollo Client (RSC)   │
                           │  (GraphQL API)         │
                           └────────────────────────┘
```

## Key Components & Pages

1. **`WebhookPage` (`webhooks/page.tsx`)**
   - The Server Component serving as the entry point for the listing page.
   - Wraps client components in `SectionErrorBoundary` and `Suspense` fallbacks.
2. **`WebhookContext`**
   - Manages the state for tables, generic global listing variables, sorting, pagination, and debounce searching.
   - Executes the primary `GET_WEBHOOK_CREDENTIALS` query using `@apollo/client/react`'s `useSuspenseQuery`.
3. **`WebhookDetailsPage` (`webhooks/[encodedWebhookId]/page.tsx`)**
   - RSC for the specific details of a single webhook credential. Decodes ID and falls back on standard `Suspense` components while loading.
4. **`WebhookDetailsView`**
   - Primary client view inside the details page. Uses `useWebhookDetailsView` custom hook for local logic around mutations (`ROTATE_WEBHOOK_SECRET`).

## Role-based Capabilities

The interface behaves differently depending on the active user role, managed by `useCapabilities` and the `WEBHOOK_CAPABILITIES_MAP` located in `src/lib/permissions/capabilities/webhook.capabilities.ts`:

- **PSP Admin**
  - Full CRUD operations available (Create, Edit).
  - Can activate / deactivate webhook credentials.
  - Can rotate (regenerate) webhook secrets.
  - *No PSP column or filter provided* as they are already scoped to their own PSP.
- **Platform Admin**
  - Cannot Create, Edit, or Rotate Secrets.
  - Read-only visibility.
  - Can see a "PSP" filter dropdown and PSP identity column in the tables.

## Related Documentation

- [Webhooks Listing & Filtering](./webhooks-listing-filtering.md)
- [Webhooks Details & Management](./webhooks-details-management.md)

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
