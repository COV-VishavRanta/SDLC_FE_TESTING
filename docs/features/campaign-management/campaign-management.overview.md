# Campaign Management Overview

## Purpose & Typical User Journey

The Campaign Management module handles the end-to-end lifecycle of promotional campaigns for Pop Logic. The module supports seven roles — **Brand Admin**, **Campaign Manager**, **PSP Admin**, **Production Operator**, **Store Admin**, **Store Operator**, and **Regional Manager** — each seeing a tailored set of actions, filters, and table columns governed by the Capabilities pattern (see [campaign-capabilities.md](campaign-capabilities.md)).

**Typical Workflow:**

1. **List View (`/campaign-management`)**: Users view a filterable, server-paginated list of campaigns via TanStack React Table. Global statistics are shown at the top in `CampaignStatCards`. An optional `?status=` query param pre-filters the status column on initial render.
2. **Details View (`/campaign-management/[id]`)**: Deep dive into a campaign, organised in four tabs — `Details`, `Orders`, `Reorders`, and `Installation Proof` — whose visibility is determined by role capabilities and campaign status. The `[id]` segment is an encoded value decoded with `decodeId()`; an invalid ID triggers `notFound()`.
3. **Sub-Actions**: The workflow branches into guarded sub-pages: `Import Promotions`, `Promotions Reuse`, `Store Distribution`, `Order Shipment`, and `Verify Installation Proof`.
4. **Role-Based Access**: Capabilities dynamically scale functionality per role. Campaign Managers additionally enforce ownership — they can only perform write actions on campaigns assigned to them.

## Architecture

The module embraces Next.js 16 App Router paradigms. Data fetching primarily occurs on the React Server Components (RSC) layer where feasible, pushing complex interactivity into localised Client Components wrapped in domain-specific Context Providers.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  CampaignManagementPage (RSC — app/(protected)/campaign-management)      │
│                                                                          │
│  searchParams: { status? }  →  initialStatus passed to Provider         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  CampaignManagementProvider (Client Context)                       │  │
│  │                                                                    │  │
│  │  ┌─────────────────┐ ┌──────────────────┐ ┌────────────────────┐  │  │
│  │  │CampaignPage     │ │CampaignStatCards │ │ CampaignFilters    │  │  │
│  │  │  Header          │ │ (stat counts)    │ │ (search/type/      │  │  │
│  │  │ (Client)         │ │  (Client)        │ │  status/brand/     │  │  │
│  │  │                  │ │                  │ │  store/archived)   │  │  │
│  │  └─────────────────┘ └──────────────────┘ └────────┬───────────┘  │  │
│  │                                                     │              │  │
│  │              ┌──────────────────────────────────────┘              │  │
│  │              ▼                                                     │  │
│  │   ┌──────────────────────────────────┐                             │  │
│  │   │  CampaignTable (TanStack)         │                             │  │
│  │   │  (Client — server-side paging)    │                             │  │
│  │   └──────────────────────────────────┘                             │  │
│  │                                                                    │  │
│  │   useCampaignManagementContext():                                  │  │
│  │   - Sorting / Pagination / Filtering State                         │  │
│  │   - statusCounts (for StatCards)                                   │  │
│  │   - Mutations: CREATE / UPDATE / DELETE / ARCHIVE campaign         │  │
│  │   - brandsList  (PSP Admin brand filter dropdown)                  │  │
│  │   - storesList  (Brand Admin / Campaign Manager store filter)      │  │
│  │   - capabilities (from CAMPAIGN_CAPABILITIES_MAP)                  │  │
│  │                                                                    │  │
│  └───────────────────────────┬────────────────────────────────────────┘  │
│                              │ Apollo useSuspenseQuery / useMutation     │
└──────────────────────────────┼───────────────────────────────────────────┘
                               ▼
                  ┌────────────────────────────┐
                  │  Apollo Client (Browser)   │
                  │  LIST_CAMPAIGNS            │
                  │  GET_BRANDS                │
                  └────────────────────────────┘
```

## State Management Strategy

To prevent prop-drilling across the varied views, state is lifted using the **Context-Hook Pattern**:

- Logic related to URL state, Apollo mutations, cache evictions, and TanStack Table properties are encapsulated inside hooks like `useCampaignManagementContext.tsx` or `useCampaignDetailsContext.tsx`.
- UI Components purely consume these hooks (`<CampaignTable />` only concerns itself with rendering cells).
- The management context exposes `statusCounts` derived from the `LIST_CAMPAIGNS` query for use by `CampaignStatCards`.
- All campaign CRUD mutations (create, update, delete, archive) live inside the management context and are triggered by the respective dialogs.

### Filter State (Listing Context)

The listing context holds a `FilterState` with these fields:

| Filter         | Default   | Role-Gated                                               |
| -------------- | --------- | -------------------------------------------------------- |
| `search`       | `''`      | No                                                       |
| `campaignType` | `ALL`     | No                                                       |
| `status`       | `ALL`     | No                                                       |
| `isArchived`   | `'false'` | Yes — `showArchiveFilter`                                |
| `brandId`      | `ALL`     | Yes — `showBrandFilter` (PSP Admin)                      |
| `storeId`      | `ALL`     | Yes — `showStoreFilter` (Brand Admin / Campaign Manager) |

### Served Mutations (Listing Context)

| Mutation                  | Triggered by                                        |
| ------------------------- | --------------------------------------------------- |
| `CREATE_CAMPAIGN`         | `CampaignDialog` (create mode)                      |
| `UPDATE_CAMPAIGN`         | `CampaignDialog` (edit mode)                        |
| `DELETE_CAMPAIGN`         | `DeleteCampaignDialog`                              |
| `ARCHIVE_CAMPAIGN`        | `ArchiveCampaignDialog` / `UnarchiveCampaignDialog` |
| `ASSIGN_CAMPAIGN_MANAGER` | `CampaignActions` (Assign to Self button)           |

### Table Columns (Capability-Driven)

| Column          | Controlled by          | Visible for                                                  |
| --------------- | ---------------------- | ------------------------------------------------------------ |
| `name`          | Always                 | All roles                                                    |
| `brandName`     | `showBrandColumn`      | PSP Admin, Production Operator                               |
| `type`          | Always                 | All roles                                                    |
| `status`        | Always                 | All roles                                                    |
| `totalQuantity` | `showQuantityColumn`   | PSP Admin, Production Operator                               |
| `storeCount`    | `showStoreColumn`      | Brand Admin, Campaign Manager                                |
| `promotions`    | `showPromotionsColumn` | Brand Admin, Campaign Manager, Store roles, Regional Manager |
| `createdAt`     | Always                 | All roles                                                    |
| `shipByDate`    | Always                 | All roles                                                    |
| `actions`       | `showActionsColumn`    | All except Store Operator, Regional Manager                  |

### Row Actions (CampaignActions Component)

Each action button is guarded by both a capability flag AND a status eligibility set:

| Action         | Capability                | Status Set                                         |
| -------------- | ------------------------- | -------------------------------------------------- |
| Update Status  | `canEditStatus`           | `SHOW_EDIT_STATUS_BUTTON_STATUSES`                 |
| Edit           | `canEditCampaign`         | `EDITABLE_CAMPAIGN_STATUSES`                       |
| Assign to Self | `canAssignSelfToCampaign` | `EDITABLE_CAMPAIGN_STATUSES` + no existing manager |
| Delete         | `canDeleteCampaign`       | `DELETABLE_CAMPAIGN_STATUSES`                      |
| Archive        | `canArchiveCampaign`      | `ARCHIVABLE_CAMPAIGN_STATUSES` + not archived      |
| Unarchive      | `canArchiveCampaign`      | `isArchived === true`                              |

## Listing Page Components

| Component                 | Location                           | Purpose                                                                       |
| ------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `CampaignPageHeader`      | `(components)/page-header`         | Title, description, Create Campaign button (capability-gated)                 |
| `CampaignStatCards`       | `(components)/campaign-stat-cards` | 4 metric cards: Total, New, In Review, In Production                          |
| `CampaignFilters`         | `(components)/campaign-filters`    | Search + up to 5 filter dropdowns (type, status, brand, store, archived)      |
| `CampaignTable`           | `(components)/campaign-table`      | TanStack React Table with server-side sorting and pagination                  |
| `CampaignActions`         | `(components)/campaign-table`      | Per-row action buttons (Edit, Delete, Archive, Update Status, Assign to Self) |
| `DeleteCampaignDialog`    | `(components)/campaign-dialogs`    | Confirmation dialog for campaign deletion                                     |
| `ArchiveCampaignDialog`   | `(components)/campaign-dialogs`    | Confirmation dialog for archiving                                             |
| `UnarchiveCampaignDialog` | `(components)/campaign-dialogs`    | Confirmation dialog for unarchiving                                           |

## Internationalization (i18n)

The module rigorously follows the `next-intl` localisation strategy:

- **Server Metadata**: Uses `getTranslations('campaignManagement')` asynchronously inside `generateMetadata()` for dynamic `<title>` tags.
- **Client Strings**: Relies on `useTranslations('campaignManagement...')` to localise labels, toast messages, and table headers.
- **Date Formatting**: Relies on `Intl.DateTimeFormat` combined with `useLocale()` to ensure standard localised date formats (e.g., `MM/DD/YYYY` vs `DD/MM/YYYY`).

## Accessibility

- `CampaignStatCards` icons are all `aria-hidden="true"`; the `StatCard` label provides the accessible name (WCAG 1.1.1).
- `CampaignTable` has a `<TableCaption>` and an `aria-live="polite"` region announcing loading state.
- Each `TableHead` uses `aria-sort` for sortable columns.
- Filter selects all have `aria-label` attributes.
- Page metadata follows WCAG 2.4.2 Page Titled.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
