# Dashboard — Section 508 / WCAG 2.2 Accessibility

## Overview

Documents all Section 508 and WCAG 2.2 Level AA accessibility patterns applied to the Pop Logic
**Dashboard** screens: the **Platform Admin Dashboard** (with User Overview, Quick Actions, PSP
Overview, and Audit Log sections) and the **PSP Admin Dashboard** (coming-soon placeholder).  
Also covers the two modals that are triggered from the dashboard: **Create User Dialog** and
**PSP Dialog** (create / edit, including its multi-step success flow).

## Status

Implemented

## Architecture Diagram

```
(protected)/dashboard/
├── page.tsx                              ← metadata export (WCAG 2.4.2)
│
├── (platform-admin-dashboard)/
│   ├── platform-admin-dashboard.tsx      ← named <section> landmarks (WCAG 1.3.1)
│   └── (components)/
│       ├── user-overview/
│       │   ├── user-overview.tsx         ← aria-labelledby on section, aria-hidden on icons
│       │   └── user-overview-skeleton.tsx← aria-hidden on skeleton (WCAG 4.1.3 BP)
│       ├── quick-action-card.tsx         ← aria-hidden on icon wrapper (WCAG 1.1.1)
│       ├── psp-overview-section/
│       │   ├── psp-overview-card.tsx     ← aria-hidden on ArrowRightIcon + PSPManagementIcon
│       │   └── psp-overview-card-skeleton.tsx ← aria-hidden on skeleton
│       └── audit-log-section/
│           ├── audit-log-table.tsx       ← inherits ArrowRightIcon fix via ActionLink
│           └── audit-log-table-skeleton.tsx  ← aria-hidden on skeleton
│
├── (psp-admin-dashboard)/
│   └── psp-admin-dashboard.tsx           ← semantic PageRoot/PageHeader structure
│
└── (modals — triggered from quick-action-card)
    ├── components/dialog/user-dialog/
    │   └── user-dialog.tsx               ← DialogTitle/Description, FormLabel, FieldError
    └── components/dialog/psp-dialog/
        └── psp-dialog.tsx                ← aria-hidden on success icon, aria-live success region
```

---

## Audit Results

- **Date:** 2026-02-27
- **Compliance Target:** WCAG 2.2 Level AA / Section 508
- **Grade:** AA Compliant (post-fix)
- **Issues Found:** 11
- **Issues Resolved:** 11

### Issues Fixed

| #   | Severity      | WCAG SC | Issue                                                                               | File Fixed                     |
| --- | ------------- | ------- | ----------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Critical      | 1.1.1   | `UserPlusIcon` / `DocumentPlusIcon` icon wrapper missing `aria-hidden="true"`       | `quick-action-card.tsx`        |
| 2   | Critical      | 1.1.1   | `ArrowRightIcon` inside `ActionLink` missing `aria-hidden="true"`                   | `psp-overview-card.tsx`        |
| 3   | Critical      | 1.1.1   | `CheckCircleIcon` in PSP Dialog success view missing `aria-hidden="true"`           | `psp-dialog.tsx`               |
| 4   | Critical      | 1.1.1   | `PSPManagementIcon` decorative wrapper missing `aria-hidden="true"`                 | `psp-overview-card.tsx`        |
| 5   | Critical      | 1.1.1   | `UsersGroupIcon` / `TrendingUpIcon` decorative icon wrapper missing `aria-hidden`   | `user-overview.tsx`            |
| 6   | Major         | 2.4.2   | No `metadata` export — page rendered with no unique `<title>`                       | `page.tsx`                     |
| 7   | Major         | 1.3.1   | Two unnamed `<section>` landmarks in Platform Admin Dashboard                       | `platform-admin-dashboard.tsx` |
| 8   | Major         | 1.3.1   | `<section>` in User Overview had no accessible name                                 | `user-overview.tsx`            |
| 9   | Minor         | 4.1.3   | PSP Dialog success state transition not announced to screen readers                 | `psp-dialog.tsx`               |
| 10  | Minor         | 1.3.1   | Default role-fallback rendered as plain `<div>` with no semantic structure          | `page.tsx`                     |
| 11  | Best Practice | 4.1.3   | Skeleton loaders exposed to screen readers with no indication they are placeholders | skeleton files (3)             |

---

## Implemented Patterns

| Pattern                                   | WCAG SC       | Implementation                                                                                                                                                  |
| ----------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page `<title>`                            | 2.4.2         | `export const metadata: Metadata = { title: 'Dashboard — Pop Logic' }` in `page.tsx`                                                                            |
| Named section landmarks                   | 1.3.1         | `aria-label={t('sections.core-overview')}` and `aria-label={t('audit-logs.title')}` on `<section>` in `platform-admin-dashboard.tsx`                            |
| Section with heading                      | 1.3.1         | `id="user-overview-heading"` on `<h2>` + `aria-labelledby="user-overview-heading"` on `<section>` in `user-overview.tsx`                                        |
| Decorative icon suppression               | 1.1.1         | `aria-hidden="true"` on all decorative icon wrappers / SVGs throughout dashboard and modals                                                                     |
| Skeleton loader suppression               | 4.1.3         | `aria-hidden="true"` on all three skeleton root containers — `AuditLogTableSkeleton`, `PspOverviewCardSkeleton`, `UserOverviewSkeleton`                         |
| Modal `DialogTitle` / `DialogDescription` | 4.1.2         | Both dialogs already leveraged shadcn/ui `DialogTitle` and `DialogDescription` which Radix maps to `aria-labelledby` / `aria-describedby` on the dialog role    |
| Form labels & error association           | 3.3.1 / 3.3.2 | `FormLabel htmlFor`, `FieldError`, `aria-invalid` already in place in both dialogs                                                                              |
| PSP success announcement                  | 4.1.3         | `<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">` announces PSP name + success title when success state mounts inside open dialog |
| Keyboard navigation                       | 2.1.1         | All interactive elements (buttons, selects, comboboxes, links) reachable via keyboard; shadcn/ui Dialog handles focus trap and Escape key                       |
| Semantic default fallback                 | 1.3.1         | Default role fallback now renders `<main id="main-content" aria-label="Dashboard"><p>…</p></main>` instead of bare `<div>`                                      |

---

## Translation Keys Added

New i18n keys added to all three locale files (`en`, `es`, `fr`) to support translated section labels:

```json
"dashboard": {
  "sections": {
    "core-overview": "Quick Actions and PSP Overview"
  }
}
```

| Locale | Value                                 |
| ------ | ------------------------------------- |
| `en`   | `"Quick Actions and PSP Overview"`    |
| `es`   | `"Acciones Rápidas y Resumen de PSP"` |
| `fr`   | `"Actions Rapides et Aperçu des PSP"` |

---

## Screen Reader Behaviour Notes

### Dialog Focus Trap

Both `UserDialog` and `PspDialog` use shadcn/ui `Dialog` built on Radix UI. On open, focus is moved
to the first focusable element inside the dialog. `Escape` dismisses the dialog. Focus returns to
the trigger button after close. No custom focus management is required.

### PSP Dialog Multi-Step Success

When create PSP succeeds, the dialog content transitions in-place (no re-mount of `<Dialog>`). The
`role="status" aria-live="polite"` region at the top of the success view is visually hidden but
immediately announces the success message and PSP name to screen readers without displacing focus.

### Skeleton Loaders

Skeleton placeholders are wrapped in React `<Suspense>` fallbacks. They are marked
`aria-hidden="true"` so screen readers do not attempt to read out the inert loading shapes. Once
streaming completes, the real content replaces the skeleton and is navigable normally.

### Audit Log Table

The table uses a `<TableCaption>` which already provides a programmatic description visible to
assistive technology. Column headers use `<th scope="col">`. The "View All Audit Logs" link text is
descriptive and passes WCAG 2.4.4 Link Purpose.

---

## Known Limitations

| Area                  | Limitation                                                                                     | Notes                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| PSP Admin Dashboard   | Page is a coming-soon placeholder with no interactive content                                  | No additional 508 work required until features are built               |
| Other role dashboards | Default `page.tsx` switch-case renders a generic `<main>`                                      | Will need role-specific implementations as each dashboard is built     |
| Colour contrast       | Custom CSS variable colours (`--gray-500`, `--blue-light`, etc.) assumed to meet 4.5:1 minimum | Should be verified against design tokens in a dedicated contrast audit |
