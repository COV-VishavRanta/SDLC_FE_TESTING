# Reports Architecture

## Overview

The Reports feature provides a unified, role-filtered interface for generating and exporting operational reports across the Pop Logic platform. Users select a report type from a dropdown — the available options are filtered to only those their role is permitted to view. The selected report is fetched via GraphQL, rendered in a sortable, server-paginated TanStack Table, and can be exported to Excel or PDF.

All nine report types share a single page, a single context, and a single table component — the `REPORT_REGISTRY` config drives all behavior per report type without duplicating logic.

## Status

Implemented

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  ReportsPage (RSC — app/(protected)/reports)                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ReportsProvider (Client Context)                          │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐  │  │
│  │  │  ReportSelector  │  │     ReportExportButtons        │  │  │
│  │  │  (shadcn Select) │  │  (Excel / PDF lazy GraphQL)    │  │  │
│  │  └──────────────────┘  └────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  ReportTableWrapper                                │   │  │
│  │  │                                                    │   │  │
│  │  │   ┌──── SectionErrorBoundary (keyed) ──────────┐  │   │  │
│  │  │   │   └── <Suspense fallback={Skeleton}>       │  │   │  │
│  │  │   │         └── ReportTable (keyed)            │  │   │  │
│  │  │   └────────────────────────────────────────────┘  │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │   Apollo Client        │
               │   useSuspenseQuery /   │
               │   useLazyQuery (export)│
               └────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │   FastAPI Backend      │
               │   (9 report queries +  │
               │    9 export mutations) │
               └────────────────────────┘
```

## Key Concepts

| Concept                              | Description                                                                                                                                                                                                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **REPORT_REGISTRY**                  | The central config array in `config/report-registry.ts`. Each entry defines a `ReportConfig` that fully describes one report type: its GraphQL queries, column definitions, sort field mappings, entity type, allowed roles, and pagination defaults. No report-specific logic lives outside this config. |
| **ReportConfig**                     | The TypeScript interface that shapes each registry entry. Holds the fetch query, export query, `getColumns` factory, `sortFieldMap`, `dataPath`, `entityType`, and `defaultSort`.                                                                                                                         |
| **Role-filtered availability**       | `getAvailableReports(role)` filters the registry to only entries whose `allowedRoles` array includes the current user's role. `ReportSelector` only surfaces reports the user may view.                                                                                                                   |
| **Entity type scoping**              | Each report has an `entityType` of `'psp'`, `'brand'`, or `'none'`. PSP and Brand reports automatically inject the `pspId` or `brandId` from `GlobalProtectedContext` into GraphQL variables. Reports with `entityType: 'none'` (e.g. Regional Manager reports) need no entity context.                   |
| **ReportsContext**                   | Client context created by `ReportsProvider` / `useReportsContext`. Owns all state: selected report key, active config, sorting, pagination, entity ID, and pending transition flag. All child components consume only this context — no prop drilling.                                                    |
| **Keyed remount strategy**           | Both `SectionErrorBoundary` and `ReportTable` receive `key={selectedReportKey}`. Switching reports forces a full React remount, resetting error boundaries and triggering a fresh Apollo query — no stale data from a previous report can leak through.                                                   |
| **Server-side pagination & sorting** | TanStack Table is configured for `manualPagination` and `manualSorting`. Sort field IDs are translated to backend enum values via `sortFieldMap`. Sorting changes reset `pageIndex` to 0.                                                                                                                 |
| **Stale-UI transitions**             | Sorting and pagination changes are wrapped in `useTransition` (`isPending`). The previous table content remains visible while new data loads, avoiding layout flicker.                                                                                                                                    |
| **Export flow**                      | `ReportExportButtons` uses `useLazyQuery` with `fetchPolicy: 'no-cache'`. On click it fires the export GraphQL query with the current sort state, decodes the base64 `fileContent` from the response, and triggers a browser download via `downloadReportFile`.                                           |
| **ViewImagesDialog**                 | The Execution Proof report includes proof image links. Clicking a link opens `ViewImagesDialog` with the image URLs. Column definition receives `onViewImages` callback via `getExecutionProofColumns({ onViewImages })`.                                                                                 |

## Implementation Details

### Folder Structure

```
reports/
├── loading.tsx                              # Route-level skeleton (Next.js streaming)
├── page.tsx                                 # RSC entry point + metadata
├── config/
│   └── report-registry.ts                  # REPORT_REGISTRY + ReportConfig type + getAvailableReports()
├── context/
│   ├── ReportsContext.tsx                  # ReportsProvider + ReportsContext
│   └── useReportsContext.ts                # All state: report selection, sorting, pagination, entity ID
├── utils/
│   └── download-report.ts                  # Base64 decode + browser download trigger
└── (components)/
    ├── report-selector/
    │   └── ReportSelector.tsx              # shadcn Select — filters to role-available reports
    ├── report-export-buttons/
    │   └── ReportExportButtons.tsx         # Excel + PDF export buttons; useLazyQuery
    ├── report-table-wrapper/
    │   └── ReportTableWrapper.tsx          # Keyed error boundary + Suspense; empty state
    └── report-table/
        ├── ReportTable.tsx                 # TanStack Table; drives query from context
        ├── ReportTable.loading.tsx         # Full skeleton + inline row skeletons
        └── columns/
            ├── campaign-summary.columns.tsx
            ├── exception-queue.columns.tsx
            ├── execution-proof.columns.tsx
            ├── issues-reorders.columns.tsx
            ├── ops-dashboard.columns.tsx
            ├── proof-review.columns.tsx
            ├── shipments-tracking.columns.tsx
            ├── store-orders.columns.tsx
            └── survey-response.columns.tsx
```

### Page Structure (`page.tsx`)

The page is a **Server Component** that:

1. Generates `<Metadata>` (title and description) from i18n translations.
2. Wraps the entire interactive area in a `<Suspense fallback={<ReportTableSkeleton />}>` for streaming — the route-level `loading.tsx` also provides a full-page skeleton during navigation.
3. Mounts `ReportsProvider` around all interactive children.
4. Renders `ReportSelector` and `ReportExportButtons` side-by-side above the table.
5. Renders `ReportTableWrapper` below, which conditionally shows an empty state or the keyed table.

### Context & State (`useReportsContext`)

All report state is centralized in `useReportsContext` and exposed via `ReportsProvider`:

- `availableReports` — memoized list of `ReportConfig[]` for the current user's role.
- `selectedReportKey` / `setSelectedReportKey` — the chosen `ReportKey` enum value. Starts `null` so the placeholder is shown first. Changing the key resets sorting to `config.defaultSort` and pagination to page 1.
- `activeConfig` — the `ReportConfig` entry matching `selectedReportKey`, or `null`.
- `sorting` / `setSorting` — `SortingState` from TanStack Table. Updates are wrapped in `useTransition`.
- `pagination` / `setPagination` — `PaginationState`. Updates are wrapped in `useTransition`.
- `entityId` — derived from `activeConfig.entityType` plus `selectedPspId` / `selectedBrandId` from `GlobalProtectedContext`.
- `isPending` — `true` while a transition is in flight; used to show inline loading overlay.

### Report Registry (`REPORT_REGISTRY`)

Each `ReportConfig` entry provides:

| Field            | Purpose                                                                   |
| ---------------- | ------------------------------------------------------------------------- |
| `key`            | `ReportKey` enum — unique identifier used as React keys and for matching  |
| `labelKey`       | i18n translation key for the selector label                               |
| `entityType`     | `'psp'` \| `'brand'` \| `'none'` — determines which entity ID is injected |
| `allowedRoles`   | Array of `UserRole` values that may access this report                    |
| `fetchQuery`     | Apollo `DocumentNode` for the paginated data query                        |
| `exportQuery`    | Apollo `DocumentNode` for the export query                                |
| `getColumns`     | Factory returning `ColumnDef<any>[]` for TanStack Table                   |
| `sortFieldMap`   | Maps TanStack column IDs to backend sort field enum strings               |
| `dataPath`       | Key used to extract `{ items, pagination }` from the GraphQL response     |
| `exportDataPath` | Key used to extract the `ReportExportPayload` from the export response    |
| `defaultSort`    | Initial sort applied when a report is selected                            |
| `columnCount`    | Column count for the skeleton loader                                      |

### Available Reports

| Report                | Key                     | Entity Type | Allowed Roles                  |
| --------------------- | ----------------------- | ----------- | ------------------------------ |
| Campaign Summary      | `CAMPAIGN_SUMMARY`      | brand       | Brand Admin, Campaign Manager  |
| Exception Queue       | `EXCEPTION_QUEUE`       | none        | Regional Manager               |
| Execution Proof       | `EXECUTION_PROOF`       | brand       | Brand Admin, Campaign Manager  |
| Issues & Reorders     | `ISSUES_REORDERS`       | psp         | PSP Admin, Production Operator |
| Ops Dashboard Metrics | `OPS_DASHBOARD_METRICS` | psp         | PSP Admin, Production Operator |
| Proof Review          | `PROOF_REVIEW`          | none        | Regional Manager               |
| Shipments Tracking    | `SHIPMENTS_TRACKING`    | psp         | PSP Admin, Production Operator |
| Store Orders          | `STORE_ORDERS`          | psp         | PSP Admin, Production Operator |
| Survey Response       | `SURVEY_RESPONSE`       | brand       | Brand Admin, Campaign Manager  |

### Export Flow (`ReportExportButtons`)

1. User clicks **Excel** or **PDF**.
2. `buildExportVariables` assembles the export payload: `exportFormat`, current sort, and `pspId`/`brandId` if required.
3. `useLazyQuery` fires the active config's `exportQuery` with `fetchPolicy: 'no-cache'`.
4. The response `fileContent` (base64-encoded) is passed to `downloadReportFile`.
5. `downloadReportFile` decodes the base64 string, constructs a `Blob`, creates an object URL, programmatically clicks a temporary `<a>` element, and revokes the URL.
6. Buttons are disabled while the export is in-flight and when no report or entity is selected.

## Security Considerations

- Report availability is role-gated client-side via `getAvailableReports` and enforced server-side by the FastAPI backend.
- Entity scoping (`pspId` / `brandId`) ensures users only receive data for their own organization.
- Export URLs are ephemeral object URLs created and immediately revoked — no file content is persisted in browser storage.
- The export query uses `fetchPolicy: 'no-cache'` to prevent sensitive report data from being stored in the Apollo cache.

## Future Implementation (TODO)

- [ ] Add date-range filtering support for applicable reports
- [ ] Add column visibility toggles per report type
- [ ] Support report-specific filter panels (e.g., status filter for Exception Queue)

## Related Documentation

- [GraphQL & Apollo Client patterns](../../.github/instructions/graphql-apollo.instructions.md)
- [Next.js patterns](../../.github/instructions/nextjs.instructions.md)
- [Brand Management](../brand-management/brand-details.overview.md)
- [Campaign Management](../campaign-management/)
