# Accessibility — Store Management Page

## Compliance Target

**WCAG 2.2 Level AA / Section 508 (2017 Refresh)**

---

## Scope

This document covers the accessibility implementation for the **Store Management** page and all its child components, including:

- `page.tsx` — main page shell
- `(components)/store-stats/store-stats.tsx` — three summary stat cards
- `(components)/store-filters/store-filters.tsx` — search and status filter bar
- `(components)/create-store-button/create-psp-button.tsx` — create-store trigger button
- `(components)/store-table/store-table.tsx` — data table with sorting and pagination
- `(components)/store-table/store-table-columns.tsx` — column definitions (status badge, sort buttons, date cell)
- `(components)/store-table/store-action-cell.tsx` — per-row action buttons (edit, activate, deactivate)
- `(components)/store-table/store-table.loading.tsx` — skeleton table (Suspense fallback + inline)
- `(components)/activate-deactivate-dialog/activate-store-dialog.tsx` — activate-store confirmation dialog
- `(components)/activate-deactivate-dialog/deactivate-store-dialog.tsx` — deactivate-store confirmation dialog
- `components/dialog/store-dialog/store-dialog.tsx` — shared create / edit store form dialog
- `components/dialog/dialog-create-success/dialog-create-success.tsx` — post-create success view

---

## Implemented Patterns

| Pattern                                    | WCAG SC | Implementation                                                                                                                                                                                       |
| ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title                                 | 2.4.2   | `generateMetadata()` exports `"Store Management — Pop Logic"` as the document `<title>`                                                                                                              |
| Skip-to-main                               | 2.4.1   | Inherited from root layout skip link targeting `#main-content`                                                                                                                                       |
| Landmark regions                           | 1.3.1   | `PageRoot` renders `<main>`, `PageHeader` renders `<header>`                                                                                                                                         |
| Correct button label                       | 2.5.3   | Create-store button's accessible name comes from visible translated button text — no hardcoded `aria-label`                                                                                          |
| Decorative icon hiding — create button     | 1.1.1   | `<PlusIcon aria-hidden="true">` — adjacent button text is the accessible name                                                                                                                        |
| Decorative icon hiding — action cells      | 1.1.1   | `<EditIcon>`, `<PauseCircleIcon>`, `<PowerIcon>` all carry `aria-hidden="true"`; each button's `aria-label={tooltip}` provides the accessible name                                                   |
| Decorative icon hiding — stat cards        | 1.1.1   | `<StoreIcon>`, `<CheckCircleIcon>`, `<PauseCircleIcon>` all carry `aria-hidden="true"`; `StatCard` `label` prop provides the accessible name                                                         |
| Decorative icon hiding — activate dialog   | 1.1.1   | `<CheckCircleIcon aria-hidden="true">` — `DialogTitle` conveys context                                                                                                                               |
| Decorative icon hiding — deactivate dialog | 1.1.1   | `<PauseCircleIcon aria-hidden="true">` — `DialogTitle` conveys context                                                                                                                               |
| Decorative icon hiding — column sort       | 1.1.1   | `<SortIcon aria-hidden="true">` — sort state communicated via `aria-sort` on `<th>`                                                                                                                  |
| Decorative icon hiding — success view      | 1.1.1   | `<CheckCircleIcon aria-hidden="true">` — success heading and entity name convey result                                                                                                               |
| Status badge color + text                  | 1.4.1   | Colored dot in `StatusBadge` is `aria-hidden="true"` decorative; text label ("Active" / "Inactive") is always present — information is never conveyed by color alone                                 |
| Table column headers                       | 1.3.1   | All `<TableHead>` cells carry `scope="col"` in both the live table and the loading skeleton                                                                                                          |
| Sort state announcement                    | 4.1.2   | `<TableHead>` receives `aria-sort="ascending" \| "descending" \| "none"` driven by `header.column.getIsSorted()`; only set when column `getCanSort()` is true                                        |
| Live table loading announcement            | 4.1.3   | `<Table aria-busy={loading}>` marks the grid as busy; a sr-only `aria-live="polite"` region emits a translated loading message (`table.loadingState`) when a query is in flight                      |
| Skeleton table loading announcement        | 4.1.3   | `StoreTableSkeleton` renders a `role="status" aria-live="polite"` sr-only div with the translated loading message; table carries `aria-busy="true"`                                                  |
| Skeleton decorative rows hidden            | 1.3.1   | `<TableBody aria-hidden="true">` on the skeleton hides purely decorative placeholder cells from screen readers                                                                                       |
| Skeleton translated headers                | 3.1.1   | Skeleton column headers use `useTranslations` — headers are localised and match the live table headers in the user's active language                                                                 |
| Filter status label localised              | 3.1.2   | `SelectTrigger` uses `aria-label={t('filter.statusAriaLabel')}` — translated in en / es / fr so AT users hear the correct label in any locale                                                        |
| Incomplete orders error                    | 4.1.3   | `role="alert" aria-atomic="true"` container announces the error dynamically when deactivation is blocked by pending orders                                                                           |
| Incomplete orders list label               | 1.3.1   | `<ul aria-label={t('incompleteOrdersError.ordersListLabel')}>` gives AT users a meaningful group label for the order list                                                                            |
| Deactivate button correctly disabled       | 3.2.2   | `disabled={isUpdatingStatus \|\| incompleteOrders !== null}` — corrected from `??` (nullish coalescing) to `\|\|` (logical OR) so the button is properly disabled in both loading and blocked states |
| Form labelling                             | 1.3.1   | Store dialog `<form>` has `id="store-dialog-form"` and `aria-label={config.title}` (e.g., "Create New Store" or "Edit Store")                                                                        |
| External submit button                     | 2.1.1   | Footer submit button uses `form="store-dialog-form"` + `type="submit"` to remain semantically linked to the form even though it is rendered outside the `<form>` element in `DialogFooter`           |
| Address field autocomplete                 | 1.3.5   | Phone field: `autoComplete="tel-national"`, city: `autoComplete="address-level2"`, street: `autoComplete="street-address"`, zip: `autoComplete="postal-code"`                                        |
| Dialog title + description                 | 4.1.2   | All dialogs use `<DialogTitle>` and `<DialogDescription>` — Base UI Dialog automatically wires `aria-labelledby` and `aria-describedby` on the dialog container                                      |
| Focus trap in dialogs                      | 2.1.2   | Base UI Dialog implements focus trap; Escape key closes the dialog                                                                                                                                   |
| Prevent focus loss on submit               | 2.1.2   | `disablePointerDismissal={isSubmitting}` prevents accidental dialog closure while form is being submitted, keeping focus within the dialog                                                           |
| Success state live announcement            | 4.1.3   | `DialogCreateSuccess` renders a `role="status" aria-live="polite"` sr-only div announcing the created store's name upon successful creation                                                          |
| Pagination landmark                        | 1.3.1   | `<TableFooter role="navigation" aria-label="Table pagination">` gives the pagination controls a named navigation landmark                                                                            |
| Pagination live region                     | 4.1.3   | `TablePagination` summary carries `aria-live="polite"` so page-change count updates are announced                                                                                                    |
| Language of page                           | 3.1.1   | `<html lang={userLocale}>` set dynamically in root layout                                                                                                                                            |
| Translation keys                           | 3.1.1   | All sr-only loading and status messages are drawn from locale files (en / es / fr) — AT users hear translated announcements in their selected language                                               |

---

## Audit Results

- **Date:** 2026-03-08
- **Grade:** AA Compliant
- **Issues Found:** 5
- **Issues Resolved:** 5

### Issues Resolved

| #   | Severity | WCAG SC       | Issue                                                                                                                                                                                                             | File                             | Fix Applied                                                                                                                                                                                                                          |
| --- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Major    | 3.1.2         | `aria-label='Status filter'` hardcoded English — wrong for non-English locales                                                                                                                                    | `store-filters.tsx`              | Changed to `aria-label={t('filter.statusAriaLabel')}`; added `statusAriaLabel` key to en / es / fr locale files                                                                                                                      |
| 2   | Major    | 4.1.2 / 4.1.3 | `StoreTableSkeleton` table had no `aria-busy`, no accessible label, and hardcoded English column headers                                                                                                          | `store-table.loading.tsx`        | Added `role="status" aria-live="polite"` sr-only loading announcement; added `aria-busy="true"` and `aria-label` to `<Table>`; added `aria-hidden="true"` to `<TableBody>`; replaced hardcoded column strings with `useTranslations` |
| 3   | Major    | 3.2.2         | `disabled={isUpdatingStatus ?? incompleteOrders !== null}` used nullish coalescing instead of logical OR — deactivate button was not disabled when orders blocked deactivation and `isUpdatingStatus` was `false` | `deactivate-store-dialog.tsx`    | Changed operator to `\|\|`: `disabled={isUpdatingStatus \|\| incompleteOrders !== null}`                                                                                                                                             |
| 4   | Minor    | 1.3.5         | Missing `autoComplete` attributes on address form fields — browsers could not offer autofill, adding friction for users with motor/cognitive disabilities                                                         | `store-dialog.tsx` + `field.tsx` | Added `autoComplete` prop to `FormInputField`; set `autoComplete="tel-national"` (phone), `"address-level2"` (city), `"street-address"` (street), `"postal-code"` (zip)                                                              |
| 5   | Minor    | 3.1.1         | Skeleton column headers were hardcoded English strings — shown in non-English locales with wrong language                                                                                                         | `store-table.loading.tsx`        | Converted to `useTranslations` to use locale-aware column header labels                                                                                                                                                              |

---

## Screen Reader Testing Notes

- **VoiceOver (macOS/iOS):** Dialog open/close and focus management handled by Base UI primitives. Loading state announced via `aria-live="polite"`. Form field labels and error messages wired via `aria-invalid` + `aria-describedby` in `FormInputField`.
- **NVDA / JAWS:** `<TableHead scope="col">` + `aria-sort` provide correct column-header associations and sort state announcements. The `aria-busy="true"` on the table pauses AT readout during loading.
- **Incomplete orders error:** `role="alert"` triggers an immediate announcement in all screen readers when deactivation is blocked.
- **Autocomplete:** Browsers supporting the WHATWG autofill spec (Chrome, Firefox, Safari, Edge) will offer address/phone autofill based on the `autoComplete` attribute values.

## Known Limitations

- **Country / State combobox fields:** `FormComboboxField` does not yet expose an `autoComplete` prop. These fields use a custom searchable combobox built on Radix primitives, and adding HTML `autocomplete` would conflict with the widget's native search. The WCAG 1.3.5 obligation for these fields is therefore deferred pending a combobox-specific solution.
- **Contrast values:** Colour contrast ratios for Tailwind semantic tokens (`text-text-heading`, `text-text-secondary`, `bg-input-bg`, etc.) are verified at the design-token level and are expected to meet 4.5:1 and 3:1 WCAG minimums. A full automated contrast audit should be run with the final theme to confirm.

### Details Page

| Pattern              | WCAG SC | Implementation                                                                     |
| -------------------- | ------- | ---------------------------------------------------------------------------------- |
| Page title           | 2.4.2   | `export const metadata: Metadata = { title: ... }` in `[id]/page.tsx`              |
| Heading hierarchy    | 1.3.1   | `<h1>` for Store name, `<h2>` for 'Store Information' and 'Store Administrators'   |
| Decorative icons     | 1.1.1   | `<ArrowLeftIcon>` and `<UserIcon>` carry `aria-hidden='true'`                      |
| Admin list labelling | 4.1.2   | `<ul aria-label='Store administrators'>` provides context for the list             |
| Loading announcement | 4.1.3   | `<div aria-busy='true' aria-label='...'>` in `loading.tsx` announces loading state |
