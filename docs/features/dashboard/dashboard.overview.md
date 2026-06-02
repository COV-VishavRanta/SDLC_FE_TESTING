# Dashboard Overview

## Overview

The Dashboard in Pop Logic acts as the primary landing page and control center for all authenticated users. Instead of a single static view, the platform provides tailored, role-based dashboard experiences.

Each dashboard surfaces key metrics, quick actions, alerts, and recent activities pertinent to the user's specific operational needs. All 8 user roles now have a dedicated, fully-implemented dashboard module.

## Architecture & View Handling

The Dashboard view handling relies strictly on **Next.js Server Components** and **role-based conditional rendering**.

At the entry point (`src/app/(protected)/dashboard/page.tsx`), the server reads the user's role from the secure cookie and renders the appropriate dashboard module without client-side redirects or loading states. This ensures an instantaneous, personalized entry experience.

### Architectural Diagram

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│  DashboardPage (RSC — app/(protected)/dashboard/page.tsx)                     │
│  (Reads USER_ROLE_COOKIE_NAME from next/headers)                              │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────────┐   │
│   │                          Role Switch (switch)                         │   │
│   └──┬──────────────┬──────────────┬──────────────┬───────────────────────┘   │
│      │              │              │              │                           │
│  PLATFORM_ADMIN  PSP_ADMIN    BRAND_ADMIN   CAMPAIGN_MANAGER                 │
│      │              │              │              │                           │
│  PRODUCTION_OPERATOR │     REGIONAL_MANAGER   STORE_ADMIN                    │
│                  STORE_OPERATOR                                               │
│      ▼              ▼              ▼              ▼                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐                    │
│  │ Platform │ │  PSP     │ │  Brand   │ │  Campaign    │                    │
│  │  Admin   │ │  Admin   │ │  Admin   │ │   Admin      │                    │
│  │  (RSC)   │ │  (RSC)   │ │  (RSC)   │ │   (RSC)      │                    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘                    │
│       │            │            │               │                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐                    │
│  │  Store   │ │ Regional │ │  Store   │ │  Production  │                    │
│  │  Admin   │ │  Manager │ │ Operator │ │  Operator    │                    │
│  │  (RSC)   │ │  (RSC)   │ │  (RSC)   │ │   (RSC)      │                    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘                    │
│       │            │            │               │                           │
│       └────────────┴────────────┴───────────────┘                           │
│                                 │                                           │
│          ┌──────────────────────┴──────────────────────┐                    │
│          │          Shared Dashboard Components         │                    │
│          │  alerts-section / audit-log-section /        │                    │
│          │  campaigns-progress                          │                    │
│          └──────────────────────┬──────────────────────┘                    │
│                                 ▼                                           │
│                    ┌────────────────────────┐                               │
│                    │  Apollo Client (RSC)   │                               │
│                    └────────────────────────┘                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Role-Specific Dashboards & Sections

Each dashboard is broken down into modular layout sections tailored to the user's focus area.

### 1. Platform Admin Dashboard

**File:** `(platform-users-dashboard)/platform-admin-dashboard.tsx`  
**Focus:** High-level platform health, overarching user metrics, and global system events.

| Section                      | Component                             | Notes                                     |
| ---------------------------- | ------------------------------------- | ----------------------------------------- |
| Page Header                  | `PageHeader` / `PageTitle`            | Platform-scoped title & description       |
| User Overview                | `UserOverview`                        | System-wide user counts and active status |
| Quick Actions + PSP Overview | `QuickActionCard` + `PspOverviewCard` | Rendered side-by-side in a 2-column grid  |
| Audit Log                    | `AuditLogTable`                       | Platform-wide recent events               |

### 2. Brand Admin Dashboard

**File:** `(brand-users-dashboard)/brand-admin-dashboard.tsx`  
**Focus:** Brand-specific operations, campaign creation, active store compliance, exception requests, and brand operational alerts.

| Section                | Component                                     | Notes                                         |
| ---------------------- | --------------------------------------------- | --------------------------------------------- |
| Page Header            | `PageHeader` / `PageTitle`                    | Brand-scoped title & description              |
| Overview Cards         | `OverviewCards`                               | Active Stores + Ongoing Campaigns metrics     |
| Quick Actions + Alerts | `BrandAdminQuickActionCard` + `AlertsSection` | Rendered side-by-side in a 2-column grid      |
| Campaigns Progress     | `CampaignsProgress`                           | Uses `BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` |
| Exception Requests     | `ExceptionRequests`                           | Active store exceptions needing review        |
| Audit Log              | `AuditLogTable`                               | Brand-scoped event history                    |

### 3. Campaign Admin Dashboard

**File:** `(brand-users-dashboard)/campaign-admin-dashboard.tsx`  
**Focus:** Campaign management lifecycle, exception oversight, and brand alert monitoring (no administrative Quick Actions or Audit Log).

| Section            | Component                  | Notes                                                       |
| ------------------ | -------------------------- | ----------------------------------------------------------- |
| Page Header        | `PageHeader` / `PageTitle` | Campaign Admin-scoped title & description                   |
| Overview Cards     | `OverviewCards`            | Shared with Brand Admin — Active Stores + Ongoing Campaigns |
| Alerts             | `AlertsSection`            | Full-width alerts panel                                     |
| Campaigns Progress | `CampaignsProgress`        | Uses `BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER`               |
| Exception Requests | `ExceptionRequests`        | Active store exceptions needing review                      |

### 4. PSP Admin Dashboard

**File:** `(psp-users-dashboard)/psp-admin-dashboard.tsx`  
**Focus:** Managing fulfilling orders, ongoing campaigns pipeline, PSP alerts, and PSP administrative actions.

| Section                           | Component                                          | Notes                                       |
| --------------------------------- | -------------------------------------------------- | ------------------------------------------- |
| Page Header                       | `PageHeader` / `PageTitle`                         | PSP-scoped title & description              |
| Quick Actions + Campaigns Summary | `PspAdminQuickActionCard` + `PspAdminOverviewCard` | Rendered side-by-side in a 2-column grid    |
| Campaigns Progress                | `CampaignsProgress`                                | Uses `PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` |
| Alerts                            | `AlertsSection`                                    | Fast access to production warnings          |
| Audit Log                         | `AuditLogTable`                                    | PSP-scoped events log                       |

### 5. Production Operator Dashboard

**File:** `(psp-users-dashboard)/production-operator-dashboard.tsx`  
**Focus:** Streamlined production-floor view — campaign workload visibility and alerts without administrative controls.

| Section            | Component                  | Notes                                                       |
| ------------------ | -------------------------- | ----------------------------------------------------------- |
| Page Header        | `PageHeader` / `PageTitle` | Production Operator-scoped title & description              |
| Campaigns Summary  | `PspAdminOverviewCard`     | Shared with PSP Admin — tasks and items awaiting production |
| Campaigns Progress | `CampaignsProgress`        | Uses `PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER`                 |
| Alerts             | `AlertsSection`            | Production-level alerts                                     |

### 6. Store Admin Dashboard

**File:** `(store-users-dashboard)/store-admin-dashboard.tsx`  
**Focus:** Store-level operations including campaign compliance, exception management, and store metrics.

| Section                | Component                                     | Notes                                         |
| ---------------------- | --------------------------------------------- | --------------------------------------------- |
| Page Header            | `PageHeader` / `PageTitle`                    | Store-scoped title & description              |
| Overview Card          | `StoreAdminOverviewCard`                      | Store-specific metrics                        |
| Quick Actions + Alerts | `StoreAdminQuickActionCard` + `AlertsSection` | Rendered side-by-side in a 2-column grid      |
| Campaigns Progress     | `CampaignsProgress`                           | Uses `STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` |
| Audit Log              | `AuditLogTable`                               | Store-scoped event history                    |

### 7. Regional Manager Dashboard

**File:** `(store-users-dashboard)/regional-manager-dashboard.tsx`  
**Focus:** Regional oversight — store metrics and campaign status across managed stores (no Quick Actions or Audit Log).

| Section            | Component                  | Notes                                         |
| ------------------ | -------------------------- | --------------------------------------------- |
| Page Header        | `PageHeader` / `PageTitle` | Regional Manager-scoped title & description   |
| Overview Card      | `StoreAdminOverviewCard`   | Shared with Store Admin — store-level metrics |
| Alerts             | `AlertsSection`            | Regional alerts                               |
| Campaigns Progress | `CampaignsProgress`        | Uses `STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` |

### 8. Store Operator Dashboard

**File:** `(store-users-dashboard)/store-operator-dashboard.tsx`  
**Focus:** Operational store view for day-to-day campaign monitoring and alerts (no Quick Actions or Audit Log).

| Section            | Component                  | Notes                                         |
| ------------------ | -------------------------- | --------------------------------------------- |
| Page Header        | `PageHeader` / `PageTitle` | Store Operator-scoped title & description     |
| Overview Card      | `StoreAdminOverviewCard`   | Shared with Store Admin — store-level metrics |
| Alerts             | `AlertsSection`            | Store-level alerts                            |
| Campaigns Progress | `CampaignsProgress`        | Uses `STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` |

## Shared Modules

Prominent sections are decoupled into common structural components under `(components)/` shared among all dashboard layouts:

| Module               | Path                               | Purpose                                                                          |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `alerts-section`     | `(components)/alerts-section/`     | Unified UI for urgent notifications; includes `AlertsSkeleton`                   |
| `audit-log-section`  | `(components)/audit-log-section/`  | Read-only recent entity log table; includes `AuditLogTableSkeleton`              |
| `campaigns-progress` | `(components)/campaigns-progress/` | Horizontal Kanban-style workflow blocks; controlled via `displayOrder` constants |

### Campaign Display Order Constants

| Constant                                 | Used By                                       |
| ---------------------------------------- | --------------------------------------------- |
| `BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` | Brand Admin, Campaign Admin                   |
| `PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER`   | PSP Admin, Production Operator                |
| `STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER` | Store Admin, Regional Manager, Store Operator |

## Error Handling Pattern

All async dashboard sections wrap their content in `<SectionErrorBoundary>` + `<Suspense>` to ensure graceful degradation. Skeleton components (`*Skeleton`) provide a loading state for each section independently.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
