# Survey Management Architecture

## Overview

Survey Management is a multi-role feature that enables PSP Admins to create and manage surveys, assign them to brands and stores, and collect structured responses from store-level users. It supports a full lifecycle from template authoring → survey creation → brand/store assignment → response collection → survey closure.

The feature is built as a Next.js 16 App Router module with server-side pagination, React Hook Form + Zod validation, Apollo Client 4.x for GraphQL data fetching, and a role-gated multi-layer access control system.

---

## Status

Implemented

---

## Feature Architecture Overview

```mermaid
flowchart TB
    subgraph ROLES["User Roles"]
        PSPA["PSP Admin\n• Create templates & surveys\n• Assign to brands\n• Close surveys"]
        BA["Brand Admin\n• Assign surveys to stores\n• Delete surveys"]
        SA["Store Admin\n• Add survey responses\n• View responses"]
        SO["Store Operator\n• Add survey responses"]
        RM["Regional Manager\n• View surveys only"]
    end

    subgraph PAGES["Page Structure"]
        LIST["/survey-management\n(Listing + Stats)"]
        DETAIL["/survey-management/[surveyId]\n(Survey Detail)"]
        EDIT["/survey-management/[surveyId]/edit\n(Edit Survey)"]
        PREVIEW["/survey-management/[surveyId]/preview\n(Preview Survey)"]
        ASSIGN_BRAND["/survey-management/[surveyId]/assign-brand\n(Assign to Brands)"]
        ASSIGN_STORE["/survey-management/[surveyId]/assign-store\n(Assign to Stores)"]
        ADD_RESPONSE["/survey-management/[surveyId]/add-response\n(Submit Response)"]
        TMPL_CREATE["/survey-management/template/create\n(Create Template)"]
        TMPL_EDIT["/survey-management/template/[id]/edit\n(Edit Template)"]
        TMPL_PREVIEW["/survey-management/template/[id]/preview\n(Preview Template)"]
    end

    subgraph GUARDS["Access Control"]
        SG["SurveyCapabilitiesGuard\n(sub-page gating)"]
        PG["Permission.VIEW_SURVEY_MANAGEMENT\n(page-level gate in proxy.ts)"]
    end

    PG --> LIST
    LIST --> DETAIL
    DETAIL --> EDIT & PREVIEW & ASSIGN_BRAND & ASSIGN_STORE & ADD_RESPONSE
    LIST --> TMPL_CREATE & TMPL_EDIT & TMPL_PREVIEW
    SG -.->|guards| EDIT & PREVIEW & ASSIGN_BRAND & ASSIGN_STORE & ADD_RESPONSE & TMPL_CREATE & TMPL_EDIT

    PSPA -->|full access| LIST
    BA -->|no templates tab| LIST
    SA -->|add response only| LIST
    SO -->|add response only| LIST
    RM -->|read only| LIST

    style ROLES fill:#f3e8ff,stroke:#7c3aed
    style PAGES fill:#dbeafe,stroke:#2563eb
    style GUARDS fill:#fee2e2,stroke:#dc2626
```

---

## Survey Lifecycle

```mermaid
stateDiagram-v2
    [*] --> DRAFT: CREATE_SURVEY

    DRAFT --> DRAFT: UPDATE_SURVEY
    DRAFT --> DRAFT: ASSIGN_SURVEY_TO_BRANDS
    DRAFT --> DRAFT: ASSIGN_SURVEY_TO_STORES

    DRAFT --> ACTIVE: Brands/Stores assigned\n(system-managed transition)
    ACTIVE --> ACTIVE: SUBMIT_SURVEY_RESPONSE\n(Store Admin / Operator)
    ACTIVE --> CLOSED: CLOSE_SURVEY\n(PSP Admin)

    DRAFT --> [*]: DELETE_SURVEY

    note right of DRAFT
        Editable
        Can assign brands/stores
        Not yet collecting responses
    end note

    note right of ACTIVE
        Read-only for structure
        Collecting responses
        Cannot be deleted
    end note

    note right of CLOSED
        Responses locked
        Read-only
        Cannot be re-opened
    end note
```

---

## Data Model

```mermaid
erDiagram
    SURVEY_TEMPLATE {
        string id
        string name
        string schemaJson
        boolean isActive
        int surveyCount
        datetime createdAt
    }

    SURVEY {
        string id
        string name
        string description
        string schemaJson
        string status
        string templateId
        int responseCount
        datetime createdAt
    }

    BRAND {
        string id
        string name
    }

    STORE {
        string id
        string name
        string brandId
    }

    SURVEY_RESPONSE {
        string id
        string surveyId
        string storeId
        json answers
        datetime submittedAt
    }

    SURVEY_TEMPLATE ||--o{ SURVEY : "used by"
    SURVEY ||--o{ BRAND : "assigned to"
    BRAND ||--o{ STORE : "contains"
    SURVEY ||--o{ SURVEY_RESPONSE : "has"
    STORE ||--o{ SURVEY_RESPONSE : "submits"
```

---

## Role-Based Capabilities Matrix

| Capability                      | PSP Admin | Brand Admin | Store Admin | Store Operator | Regional Manager |
| ------------------------------- | :-------: | :---------: | :---------: | :------------: | :--------------: |
| Create survey                   |     ✓     |             |             |                |                  |
| Edit survey                     |     ✓     |             |             |                |                  |
| Delete survey                   |     ✓     |      ✓      |             |                |                  |
| Preview survey                  |     ✓     |      ✓      |             |                |                  |
| Close survey                    |     ✓     |             |             |                |                  |
| Assign to brand                 |     ✓     |             |             |                |                  |
| Assign to store                 |           |      ✓      |             |                |                  |
| Add response                    |           |             |      ✓      |       ✓        |                  |
| View responses                  |     ✓     |      ✓      |      ✓      |                |                  |
| Access Templates tab            |     ✓     |             |             |                |                  |
| Create template                 |     ✓     |             |             |                |                  |
| Show brand filter               |     ✓     |             |             |                |                  |
| Show brand assigned column      |     ✓     |             |             |                |                  |
| Show store assigned column      |     ✓     |      ✓      |             |                |                  |
| Show response count column      |     ✓     |      ✓      |             |                |                  |
| Show tabs (Surveys + Templates) |     ✓     |             |             |                |                  |

> **Guard enforcement:** Each sub-page is wrapped in `SurveyCapabilitiesGuard` which reads the matching capability flag and redirects to `/survey-management` when denied.

---

## Page Structure

### `/survey-management` — Listing Page

```mermaid
flowchart TD
    PAGE["page.tsx\n(Server Component)"]
    PROVIDER["SurveyManagementProvider\n(Context wrapper)"]
    HEADER["SurveyManagementHeader\n• Title + description\n• Create Survey button (PSP)\n• Create Template button (PSP)"]
    STATS["SurveyStatCards\n• Total / Active / Closed counts\n(GET_SURVEYS_STAT_CARDS)"]
    TABS["SurveyManagementTabs\n• Surveys tab (all roles)\n• Templates tab (PSP Admin only)"]
    FILTERS["SurveyFilters\n• Search\n• Status dropdown\n• Brand filter (PSP Admin)"]
    SURVEY_TABLE["SurveyTable\n(GET_SURVEYS - server-side)"]
    TMPL_TABLE["TemplateTable\n(GET_SURVEY_TEMPLATES - server-side)"]

    PAGE --> PROVIDER
    PROVIDER --> HEADER
    PROVIDER --> STATS
    PROVIDER --> TABS
    TABS --> FILTERS & SURVEY_TABLE
    TABS -.->|"PSP Admin only"| TMPL_TABLE
```

### `/survey-management/[surveyId]` — Detail Page

Shows the survey structure with brand → store hierarchy and response status.

```mermaid
flowchart TD
    PAGE["page.tsx\n(Server Component — decodes ID)"]
    CLIENT["SurveyDetailClient\n(GET_SURVEY_DETAIL)"]
    HEADER_AREA["Back link + Survey Title\n+ Close Survey button (PSP Admin)"]
    BRAND_ACCORDION["Brand Accordion Groups\n(each brand + its assigned stores)"]
    STORE_TABLE["BrandStoreTable\n• Store name\n• Status\n• View Response button"]

    PAGE --> CLIENT
    CLIENT --> HEADER_AREA
    CLIENT --> BRAND_ACCORDION
    BRAND_ACCORDION --> STORE_TABLE
```

### `/survey-management/[surveyId]/edit` — Edit Survey

```mermaid
flowchart TD
    GUARD["SurveyCapabilitiesGuard\nsubPage='editSurvey'"]
    PAGE["page.tsx (Server Component)"]
    HEADER["EditTemplateHeader\n• Template selector combobox\n• Save button → UPDATE_SURVEY"]
    CLIENT["EditSurveyClient\n(GET_SURVEY_DETAIL)"]
    SURVEY_DETAILS["SurveyDetails\n• Name input\n• Description textarea"]
    QUESTIONS["QuestionBuilder\n(SurveyCreatorProvider)"]
    SETTINGS["TemplateQuestionsSettingSection\n(sticky sidebar)"]

    GUARD --> PAGE --> HEADER & CLIENT
    CLIENT --> SURVEY_DETAILS & QUESTIONS & SETTINGS
```

### `/survey-management/[surveyId]/assign-brand` — Brand Assignment

```mermaid
flowchart TD
    GUARD["SurveyCapabilitiesGuard\nsubPage='assignBrand'"]
    PAGE["page.tsx (Server Component)"]
    TABLE["AssignBrandTable\n(GET_SURVEY_UNASSIGNED_BRANDS)"]
    ACTIONS["• Checkbox row selection\n• Client-side search/filter\n• Save → ASSIGN_SURVEY_TO_BRANDS"]

    GUARD --> PAGE --> TABLE --> ACTIONS
```

### `/survey-management/[surveyId]/assign-store` — Store Assignment

```mermaid
flowchart TD
    GUARD["SurveyCapabilitiesGuard\nsubPage='assignStore'"]
    PAGE["page.tsx (Server Component)"]
    TABLE["AssignStoreTable\n(GET_SURVEY_UNASSIGNED_STORES)\nfiltered by selectedBrandId from GlobalProtectedContext"]
    ACTIONS["• Checkbox row selection\n• Client-side search/filter\n• Save → ASSIGN_SURVEY_TO_STORES"]

    GUARD --> PAGE --> TABLE --> ACTIONS
```

### `/survey-management/[surveyId]/add-response` — Submit Response

```mermaid
flowchart TD
    GUARD["SurveyCapabilitiesGuard\nsubPage='addResponse'"]
    PAGE["page.tsx (Server Component)"]
    CLIENT["SurveyResponseClient\n(GET_SURVEY_DETAIL)"]
    FORM["SurveyResponseForm\n• Dynamic question rendering\n• Conditional question logic\n• Zod validation\n• Submit → SUBMIT_SURVEY_RESPONSE"]

    GUARD --> PAGE --> CLIENT --> FORM
```

### `/survey-management/[surveyId]/preview` — Preview Survey

```mermaid
flowchart TD
    GUARD["SurveyCapabilitiesGuard\nsubPage='previewSurvey'"]
    PAGE["page.tsx (Server Component)"]
    HEADER["SurveyPreviewHeader\n• Back to editor (DRAFT only)"]
    CLIENT["SurveyPreviewClient\n(GET_SURVEY_DETAIL)\n• Read-only question display"]

    GUARD --> PAGE --> HEADER & CLIENT
```

### Template Pages

```mermaid
flowchart LR
    subgraph TEMPLATE_PAGES["Template Pages (PSP Admin only)"]
        TC["/template/create\n• TemplateDetails (name)\n• QuestionBuilder\n• TemplateQuestionsSettingSection\n→ CREATE_SURVEY_TEMPLATE"]
        TE["/template/[id]/edit\n• EditTemplateClient\n• TemplateHeader (save)\n→ UPDATE_SURVEY_TEMPLATE"]
        TP["/template/[id]/preview\n• TemplatePreviewClient\n• Read-only questions"]
    end
    SG["SurveyCapabilitiesGuard\nsubPage='templates'"]
    SG --> TC & TE & TP
```

---

## State Management

### `SurveyManagementContext`

A React context wrapping the entire listing page. Managed by `useSurveyManagementContext`.

| State                  | Type                       | Purpose                                      |
| ---------------------- | -------------------------- | -------------------------------------------- |
| `activeTab`            | `'surveys' \| 'templates'` | Controls which table is visible              |
| `surveyPagination`     | `PaginationState`          | Current page + page size for survey table    |
| `templatePagination`   | `PaginationState`          | Current page + page size for template table  |
| `surveySort`           | `SortingState`             | Active sort column + direction for surveys   |
| `templateSort`         | `SortingState`             | Active sort column + direction for templates |
| `surveyFilters`        | `SurveyFilters`            | Search text, status filter, brand filter     |
| `templateSearch`       | `string`                   | Template search input (debounced)            |
| `deleteDialog`         | dialog state               | Survey delete modal open state + target      |
| `deleteTemplateDialog` | dialog state               | Template delete modal open state + target    |
| `createDialog`         | dialog state               | Create survey dialog open state              |
| `surveys`              | `SurveyListItemType[]`     | Current page of survey rows                  |
| `templates`            | `SurveyTemplateType[]`     | Current page of template rows                |
| `statCards`            | summary counts             | Total/Active/Closed counts for stat cards    |

All data is fetched via Apollo Client using `useSuspenseQuery` (tables) and `useQuery` (stat cards). Sorting and pagination changes trigger re-fetches via Apollo's reactive variables.

---

## GraphQL Operations

### Queries

| Operation                      | Purpose                                         | Variables                                                                |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `GET_SURVEYS`                  | Paginated survey list with filters              | `page`, `pageSize`, `sortBy`, `sortOrder`, `search`, `status`, `brandId` |
| `GET_SURVEYS_STAT_CARDS`       | Total / Active / Closed counts for header cards | none                                                                     |
| `GET_SURVEY_DETAIL`            | Single survey with brand groups + stores        | `id` (decoded)                                                           |
| `GET_SURVEY_TEMPLATES`         | Paginated template list                         | `page`, `pageSize`, `sortBy`, `sortOrder`, `search`                      |
| `GET_SURVEY_TEMPLATE_DETAIL`   | Single template for edit/preview                | `id`                                                                     |
| `GET_SURVEY_UNASSIGNED_BRANDS` | Brands not yet assigned to a survey             | `surveyId`                                                               |
| `GET_SURVEY_UNASSIGNED_STORES` | Stores not yet assigned, filtered by brandId    | `surveyId`, `brandId`                                                    |
| `GET_SURVEY_RESPONSE`          | Single response detail for view-response dialog | `surveyId`, `storeId`                                                    |

### Mutations

| Operation                       | Purpose                                           | Called From                         |
| ------------------------------- | ------------------------------------------------- | ----------------------------------- |
| `CREATE_SURVEY`                 | Create a new survey (optionally from template)    | CreateSurveyDialog                  |
| `UPDATE_SURVEY`                 | Save changes to survey name/description/questions | EditSurveyClient header save button |
| `DELETE_SURVEY`                 | Delete survey (DRAFT only)                        | DeleteSurveyDialog                  |
| `CLOSE_SURVEY`                  | Mark survey as CLOSED                             | SurveyDetailClient close button     |
| `ASSIGN_SURVEY_TO_BRANDS`       | Bulk-assign survey to selected brands             | AssignBrandTable save button        |
| `ASSIGN_SURVEY_TO_STORES`       | Bulk-assign survey to selected stores             | AssignStoreTable save button        |
| `SUBMIT_SURVEY_RESPONSE`        | Store admin submits a survey response             | SurveyResponseForm submit           |
| `CREATE_SURVEY_TEMPLATE`        | Create a new template                             | Template create page                |
| `UPDATE_SURVEY_TEMPLATE`        | Save changes to a template                        | Template edit page header save      |
| `DELETE_SURVEY_TEMPLATE`        | Delete template                                   | DeleteTemplateDialog                |
| `TOGGLE_SURVEY_TEMPLATE_STATUS` | Activate or deactivate a template                 | Template action cell                |

---

## Access Control Flow

```mermaid
flowchart TD
    PROXY["proxy.ts Edge Middleware\nPermission.VIEW_SURVEY_MANAGEMENT"]
    PROXY -->|Denied| DASH["Redirect /dashboard"]
    PROXY -->|Allowed| LIST_PAGE["/survey-management listing"]

    LIST_PAGE --> CAP["useCapabilities(\nSURVEY_CAPABILITIES_MAP,\nDEFAULT_SURVEY_CAPABILITIES)"]

    CAP -->|showTabs=false| SURVEY_ONLY["Survey table only\n(Brand Admin, Store Admin, etc.)"]
    CAP -->|showTabs=true| BOTH["Survey + Template tabs\n(PSP Admin)"]
    CAP -->|showBrandFilter=true| BRAND_FILTER["Brand filter visible\n(PSP Admin)"]
    CAP -->|showCreateSurveyButton=true| CREATE_BTN["Create Survey button\n(PSP Admin)"]

    LIST_PAGE --> SUBPAGE_NAV["Navigate to sub-page"]
    SUBPAGE_NAV --> GUARD["SurveyCapabilitiesGuard\nreads capability for subPage"]
    GUARD -->|capability=false| REDIRECT["Redirect /survey-management"]
    GUARD -->|capability=true| SUBPAGE["Render sub-page"]
```

### Sub-page Guard Mapping

| Sub-page URL             | Guard `subPage` value | Required Capability          | Roles with access           |
| ------------------------ | --------------------- | ---------------------------- | --------------------------- |
| `/edit`                  | `'editSurvey'`        | `canAccessEditSurveyPage`    | PSP Admin                   |
| `/preview`               | `'previewSurvey'`     | `canAccessPreviewSurveyPage` | PSP Admin, Brand Admin      |
| `/assign-brand`          | `'assignBrand'`       | `canAccessAssignBrandPage`   | PSP Admin                   |
| `/assign-store`          | `'assignStore'`       | `canAccessAssignStorePage`   | Brand Admin                 |
| `/add-response`          | `'addResponse'`       | `canAccessAddResponsePage`   | Store Admin, Store Operator |
| `/template/create`       | `'templates'`         | `canAccessTemplates`         | PSP Admin                   |
| `/template/[id]/edit`    | `'templates'`         | `canAccessTemplates`         | PSP Admin                   |
| `/template/[id]/preview` | `'templates'`         | `canAccessTemplates`         | PSP Admin                   |

---

## Survey Question System

Surveys use a **schema-based question system** where the `schemaJson` field stores the question definitions as a JSON string. The question builder is powered by the `SurveyCreatorProvider` / `useSurveyCreator` hook (a survey creator library wrapper).

```mermaid
flowchart LR
    subgraph SCHEMA["schemaJson (stored in DB)"]
        JSON_SCHEMA["{\n  questions: [\n    { id, type, text, required,\n      options, conditionalOn }\n  ]\n}"]
    end

    subgraph BUILDER["Editing (SurveyCreatorProvider)"]
        QBUILDER["QuestionBuilder\n(drag & drop)"]
        QSETTINGS["QuestionSettings\n(sidebar config)"]
    end

    subgraph RENDER["Runtime Rendering"]
        PREVIEW["SurveyPreviewClient\n(read-only display)"]
        FORM["SurveyResponseForm\n(with conditional logic)"]
    end

    SCHEMA --> PREVIEW
    SCHEMA --> FORM
    BUILDER -->|produces| JSON_SCHEMA
```

**Supported question types** (from the response form rendering):

- Text / Long text
- Single-choice (radio)
- Multi-choice (checkbox)
- Date
- Rating / Scale
- Conditional questions (shown only when a parent question answer matches a trigger value)

---

## Component Inventory

### Listing Page Components (`(components)/`)

| Component                 | Type   | Purpose                                                         |
| ------------------------- | ------ | --------------------------------------------------------------- |
| `SurveyManagementHeader`  | Client | Page title, create buttons (capability-gated)                   |
| `SurveyManagementTabs`    | Client | Survey/Template tab switcher, renders active table              |
| `SurveyFilters`           | Client | Search, status, brand filters                                   |
| `SurveyStatCards`         | Client | Total/Active/Closed summary cards                               |
| `SurveyStatCards.loading` | Server | Skeleton for stat cards                                         |
| `SurveyTable`             | Client | Server-side paginated survey listing                            |
| `SurveyTable.loading`     | Server | Skeleton for survey table                                       |
| `SurveyTableColumns`      | —      | Column definitions (name, status, brand, store, response count) |
| `SurveyActionCell`        | Client | Per-row action menu (preview/edit/delete/assign/response)       |
| `TemplateTable`           | Client | Server-side paginated template listing                          |
| `TemplateTable.loading`   | Server | Skeleton for template table                                     |
| `TemplateTableColumns`    | —      | Column definitions (name, survey count, created date)           |
| `TemplateActionCell`      | Client | Per-row actions (view/edit/delete)                              |
| `CreateSurveyDialog`      | Client | Create survey modal with name/description/template fields       |
| `DeleteSurveyDialog`      | Client | Delete confirmation modal                                       |
| `DeleteTemplateDialog`    | Client | Template delete confirmation modal                              |
| `ViewResponseDialog`      | Client | View submitted survey response                                  |

### Survey Detail Components (`[surveyId]/(components)/`)

| Component                         | Type   | Purpose                                             |
| --------------------------------- | ------ | --------------------------------------------------- |
| `SurveyDetailClient`              | Client | Survey detail orchestrator (fetch + layout)         |
| `SurveyDetails`                   | Client | Name + description form inputs (edit mode)          |
| `BrandStoreTable`                 | Client | Brand accordion → stores table with response status |
| `TemplateDetails`                 | Client | Template name input (used in template create/edit)  |
| `TemplateHeader`                  | Client | Template page header with save button               |
| `TemplateQuestionsSettingSection` | Client | Sticky question settings sidebar                    |

---

## Current Implementation

| File                                                                           | Purpose                               |
| ------------------------------------------------------------------------------ | ------------------------------------- |
| `src/app/(protected)/survey-management/page.tsx`                               | Main listing page (Server Component)  |
| `src/app/(protected)/survey-management/loading.tsx`                            | Page loading skeleton                 |
| `src/app/(protected)/survey-management/context/SurveyManagementContext.tsx`    | Context provider                      |
| `src/app/(protected)/survey-management/context/useSurveyManagementContext.ts`  | State management hook                 |
| `src/app/(protected)/survey-management/(components)/survey-management-header/` | Page header component                 |
| `src/app/(protected)/survey-management/(components)/survey-management-tabs/`   | Tab switcher                          |
| `src/app/(protected)/survey-management/(components)/survey-filters/`           | Listing filters                       |
| `src/app/(protected)/survey-management/(components)/survey-stat-cards/`        | Stat summary cards                    |
| `src/app/(protected)/survey-management/(components)/survey-table/`             | Survey table (columns + actions)      |
| `src/app/(protected)/survey-management/(components)/template-table/`           | Template table (columns + actions)    |
| `src/app/(protected)/survey-management/(components)/dialog/`                   | Create/Delete/ViewResponse dialogs    |
| `src/app/(protected)/survey-management/[surveyId]/page.tsx`                    | Survey detail page (Server Component) |
| `src/app/(protected)/survey-management/[surveyId]/(components)/`               | Detail page components                |
| `src/app/(protected)/survey-management/[surveyId]/edit/`                       | Edit survey sub-page                  |
| `src/app/(protected)/survey-management/[surveyId]/preview/`                    | Preview survey sub-page               |
| `src/app/(protected)/survey-management/[surveyId]/assign-brand/`               | Brand assignment sub-page             |
| `src/app/(protected)/survey-management/[surveyId]/assign-store/`               | Store assignment sub-page             |
| `src/app/(protected)/survey-management/[surveyId]/add-response/`               | Response submission sub-page          |
| `src/app/(protected)/survey-management/template/create/`                       | Template creation page                |
| `src/app/(protected)/survey-management/template/[templateId]/edit/`            | Template edit page                    |
| `src/app/(protected)/survey-management/template/[templateId]/preview/`         | Template preview page                 |
| `src/lib/permissions/capabilities/survey.capabilities.ts`                      | Role-based capability definitions     |
| `src/components/guards/SurveyCapabilitiesGuard.tsx`                            | Sub-page access guard                 |
| `src/graphql/queries/survey/survey.queries.ts`                                 | All survey-related GraphQL queries    |
| `src/graphql/mutations/survey/survey.mutations.ts`                             | All survey-related GraphQL mutations  |
| `src/graphql/fragments/survey.fragments.ts`                                    | Reusable GraphQL fragments            |

---

## Security Considerations

- **Page-level gate:** `Permission.VIEW_SURVEY_MANAGEMENT` in `proxy.ts` blocks unauthenticated or unauthorized users from the entire `/survey-management` route tree before any component renders.
- **Sub-page gates:** Every capability-restricted sub-page (edit, preview, assign-brand, assign-store, add-response, template pages) is wrapped in `SurveyCapabilitiesGuard`, which redirects to `/survey-management` when the user's role lacks the required capability.
- **Action-level gating:** `SurveyActionCell` and `SurveyManagementHeader` use `useCapabilities()` to show/hide action buttons — a user without `canEditSurvey` never sees the Edit button.
- **Backend enforcement:** All GraphQL mutations are independently authorized by the FastAPI backend. Frontend gating is defense-in-depth, not the sole protection.
- **ID encoding:** Survey IDs are encoded/decoded via `src/lib/id-encoder.ts` when passed through URL params.
- **Store scoping:** The `/assign-store` page scopes unassigned stores to `selectedBrandId` from `GlobalProtectedContext`, preventing cross-brand store exposure.

---

## Future Implementation (TODO)

- [ ] Notifications/alerts when a store submits a response
- [ ] Bulk survey operations (bulk close, bulk delete)
- [ ] Response analytics dashboard (charts, trend data)
- [ ] Survey response export to CSV/Excel
- [ ] Survey duplication / clone flow
- [ ] Campaign Manager view of survey results scoped to their campaign

---

## Related Documentation

- [Access Control Architecture](../access-control/access-control.architecture.md) — how `SurveyCapabilitiesGuard` and `useCapabilities` work
- [Campaign Management](../campaign-management/) — shares similar brand/store assignment pattern
- [Hooks README](../../../src/hooks/README.md) — `useCapabilities` hook documentation
- [Components README](../../../src/components/README.md) — `SurveyCapabilitiesGuard` export
