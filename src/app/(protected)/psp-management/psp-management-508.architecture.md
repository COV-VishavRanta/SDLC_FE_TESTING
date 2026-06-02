# Accessibility — PSP Management Page

## Compliance Target

**WCAG 2.2 Level AA / Section 508 (2017 Refresh)**

---

## Scope

This document covers the accessibility implementation for the **PSP Management** page and all its child components, including:

- `page.tsx` — main page shell
- `loading.tsx` — streaming skeleton
- `stat-section/` — three summary stat cards
- `psp-filter/` — search and status filter bar
- `create-psp-button/` — create-PSP trigger button
- `psp-listing/psp-table.tsx` — data table with sorting and pagination
- `psp-listing/psp-table-columns.tsx` — column definitions (status badge, sort buttons, calendar cell)
- `psp-listing/psp-action-cell.tsx` — per-row action buttons (edit, activate, deactivate)
- `psp-listing/psp-table.loading.tsx` — skeleton table
- `activate-deactivate-dialog.tsx/activate-psp-dialog.tsx` — activate confirmation dialog
- `activate-deactivate-dialog.tsx/deactivate-psp-dialog.tsx` — deactivate confirmation dialog
- `delete-psp/delete-psp-dialog.tsx` — delete PSP confirmation dialog
- `components/dialog/psp-dialog/psp-dialog.tsx` — shared create / edit PSP form dialog

---

## Implemented Patterns

| Pattern                                    | WCAG SC | Implementation                                                                                                                                                                           |
| ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title                                 | 2.4.2   | `generateMetadata()` exports translated title                                                                                                                                            |
| Skip-to-main                               | 2.4.1   | Inherited from root layout skip link targeting `#main-content`                                                                                                                           |
| Landmark regions                           | 1.3.1   | `PageRoot` renders `<main>`, `PageHeader` renders `<header>`                                                                                                                             |
| Heading hierarchy                          | 1.3.1   | `<h1>` for page title, `<h2>` for section headings (PSP Info, Admins)                                                                                                                    |
| Correct button label                       | 2.5.3   | Removed hardcoded `aria-label='Create PSP'` from create-PSP button; accessible name now comes from visible translated button text                                                        |
| Decorative icon hiding — create button     | 1.1.1   | `<PlusIcon aria-hidden="true">` — adjacent button text is the accessible name                                                                                                            |
| Decorative icon hiding — details page      | 1.1.1   | `<ArrowLeftIcon>`, `<UserIcon>` carry `aria-hidden="true"` — adjacent text provides context                                                                                              |
| Decorative icon hiding — filter reset      | 1.1.1   | `<RefreshIcon aria-hidden="true">` — button has "Reset" text and `aria-label`                                                                                                            |
| Decorative icon hiding — action cells      | 1.1.1   | `<EditIcon>`, `<PauseCircleIcon>`, `<PowerIcon>` all carry `aria-hidden="true"`; each button's `aria-label={tooltip}` provides the accessible name                                       |
| Decorative icon hiding — stat cards        | 1.1.1   | `<PSPManagementIcon>`, `<CheckCircleIcon>`, `<PauseCircleIcon>` all carry `aria-hidden="true"`; `StatCard` `label` prop provides the accessible name                                     |
| Decorative icon hiding — activate dialog   | 1.1.1   | `<CheckCircleIcon aria-hidden="true">` — `DialogTitle` conveys context                                                                                                                   |
| Decorative icon hiding — deactivate dialog | 1.1.1   | `<PauseCircleIcon aria-hidden="true">` — `DialogTitle` conveys context                                                                                                                   |
| Decorative icon hiding — delete dialog     | 1.1.1   | `<TrashIcon aria-hidden="true">` and `<InfoCircleIcon aria-hidden="true">` — adjacent text provides context                                                                              |
| Decorative icon hiding — column sort       | 1.1.1   | `<SortIcon aria-hidden="true">` — sort state communicated via `aria-sort` on `<th>`                                                                                                      |
| Decorative icon hiding — calendar cell     | 1.1.1   | `<CalendarIcon aria-hidden="true">` — date text beside it is the accessible content                                                                                                      |
| Status badge color + text                  | 1.4.1   | Colored dot in `StatusBadge` is `aria-hidden="true"` decorative; text label ("Active" / "Inactive") is always present — information is never conveyed by color alone                     |
| Table column headers                       | 1.3.1   | All `<TableHead>` cells carry `scope="col"` in both the live table and the loading skeleton                                                                                              |
| Sort state announcement                    | 4.1.2   | `<TableHead>` receives `aria-sort="ascending" \| "descending" \| "none"` driven by `header.column.getIsSorted()`; only set when column `getCanSort()` is true                            |
| Loading announcement                       | 4.1.3   | `<Table aria-busy={loading}>` marks the grid as busy; a sr-only `aria-live="polite"` region emits a translated loading message (`table.loadingState`) when a query is in flight          |
| Details loading announcement               | 4.1.3   | Details skeleton container marked with `aria-busy="true"` and `aria-label` with translated text                                                                                          |
| Form labelling                             | 1.3.1   | PSP dialog `<form>` has `id="psp-dialog-form"` and `aria-label={config.title}` (e.g., "Create New PSP" or "Edit PSP")                                                                    |
| External submit button                     | 2.1.1   | Footer submit button uses `form="psp-dialog-form"` + `type="submit"` to remain semantically linked to the form even though it is rendered outside the `<form>` element in `DialogFooter` |
| Dialog title + description                 | 4.1.2   | All dialogs use `<DialogTitle>` and `<DialogDescription>` — Radix/Base-UI Dialog automatically wires `aria-labelledby` and `aria-describedby` on the dialog container                    |
| Focus trap in dialogs                      | 2.1.2   | Radix Dialog implements focus trap; Escape key closes the dialog                                                                                                                         |
| Pagination keyboard                        | 2.1.1   | Previous / Next pagination buttons are native `<button>` elements; `disabled` state prevents interaction when unavailable                                                                |
| Pagination live region                     | 4.1.3   | Pagination summary `<p>` carries `aria-live="polite"` so page-change count updates are announced                                                                                         |
| Admin list labelling                       | 4.1.2   | `<ul aria-label="PSP administrators">` provides context for the list of admins                                                                                                           |
| Language of page                           | 3.1.1   | `<html lang={userLocale}>` set dynamically in root layout                                                                                                                                |
| Loading translation keys                   | 3.1.1   | `table.loadingState` key added to all three locale files (en, es, fr) so the sr-only loading announcement is localised                                                                   |

---

## Audit Results

- **Date:** 2026-03-11
- **Grade:** AA Compliant
- **Issues Found:** 21
- **Issues Resolved:** 21

### Issues Resolved

| #   | Severity | WCAG SC | Issue                                                                                    | File                        | Fix Applied                                                                                              |
| --- | -------- | ------- | ---------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Major    | 2.4.2   | No page-specific `<title>`                                                               | `page.tsx`                  | Added `generateMetadata()` exporting translated title                                                    |
| 2   | Critical | 2.5.3   | `aria-label='Create PSP'` hardcoded — mismatches translated button text on locale change | `create-psp-button.tsx`     | Removed hardcoded `aria-label`; accessible name now comes from visible text                              |
| 3   | Major    | 1.1.1   | `<PlusIcon>` not decorative-hidden                                                       | `create-psp-button.tsx`     | Added `aria-hidden='true'`                                                                               |
| 4   | Major    | 1.1.1   | `<RefreshIcon>` not decorative-hidden                                                    | `psp-filter.tsx`            | Added `aria-hidden='true'`                                                                               |
| 5   | Major    | 1.1.1   | `<SortIcon>` not decorative-hidden                                                       | `psp-table-columns.tsx`     | Added `aria-hidden='true'`                                                                               |
| 6   | Minor    | 1.1.1   | Status badge colored dot has no `aria-hidden`                                            | `psp-table-columns.tsx`     | Added `aria-hidden='true'` to dot `<span>`                                                               |
| 7   | Major    | 1.1.1   | `<CalendarIcon>` in date cell not decorative-hidden                                      | `psp-table-columns.tsx`     | Added `aria-hidden='true'`                                                                               |
| 8   | Critical | 1.3.1   | `<TableHead>` missing `scope="col"`                                                      | `psp-table.tsx`             | Added `scope='col'` to all header cells                                                                  |
| 9   | Major    | 4.1.2   | No `aria-sort` on sortable column headers                                                | `psp-table.tsx`             | Added `aria-sort` derived from `getIsSorted()`                                                           |
| 10  | Major    | 4.1.3   | No loading announcement for screen readers                                               | `psp-table.tsx`             | Added `aria-busy={loading}` on `<Table>` + sr-only `aria-live="polite"` region                           |
| 11  | Critical | 1.3.1   | `<TableHead>` missing `scope="col"` in skeleton                                          | `psp-table.loading.tsx`     | Added `scope='col'` to all skeleton header cells                                                         |
| 12  | Major    | 1.1.1   | `<EditIcon>`, `<PauseCircleIcon>`, `<PowerIcon>` not decorative-hidden                   | `psp-action-cell.tsx`       | Added `aria-hidden='true'` to all three; `aria-label` on each button provides the name                   |
| 13  | Major    | 1.1.1   | `<PSPManagementIcon>`, `<CheckCircleIcon>`, `<PauseCircleIcon>` not decorative-hidden    | `stat-section.tsx`          | Added `aria-hidden='true'` to all three                                                                  |
| 14  | Major    | 1.1.1   | `<CheckCircleIcon>` not decorative-hidden in activate dialog                             | `activate-psp-dialog.tsx`   | Added `aria-hidden='true'`                                                                               |
| 15  | Major    | 1.1.1   | `<PauseCircleIcon>` not decorative-hidden in deactivate dialog                           | `deactivate-psp-dialog.tsx` | Added `aria-hidden='true'`                                                                               |
| 16  | Major    | 1.1.1   | `<TrashIcon>` / `<InfoCircleIcon>` not decorative-hidden in delete dialog                | `delete-psp-dialog.tsx`     | Added `aria-hidden='true'` to both                                                                       |
| 17  | Major    | 1.3.1   | PSP form has no accessible label; footer submit button not linked to form                | `psp-dialog.tsx`            | Added `aria-label={config.title}`, `id="psp-dialog-form"`, and `form="psp-dialog-form"` on submit button |
| 18  | Minor    | —       | `table.loadingState` translation key missing in all locales                              | `locales/*.json`            | Added key to en, es, and fr translation files                                                            |
| 19  | Major    | 1.1.1   | Details page icons not decorative-hidden                                                 | `psp-details-view.tsx`      | Added `aria-hidden='true'` to Back and User icons                                                        |
| 20  | Major    | 1.3.1   | Details page heading hierarchy incorrect                                                 | `psp-details-view.tsx`      | Replaced `div` card titles with `h2`                                                                     |
| 21  | Major    | 4.1.3   | No loading announcement for details page                                                 | `loading.tsx`               | Added `aria-busy` and `aria-label` to skeleton container                                                 |

---

---

## Component-Level Notes

### PSP Table (`psp-table.tsx`)

- `aria-sort` is set only when `header.column.getCanSort()` is `true`, preventing spurious attributes on non-sortable columns (Admins, Status, Actions).
- The `aria-busy` attribute is data-driven via the `loading` flag from context, so screen readers are notified while queries are in flight without manual tracking.
- The sr-only `aria-live="polite"` region uses the new `t('table.loadingState')` key and outputs an empty string when not loading — no announcement is made when the table finishes loading (polite, non-intrusive).

### PSP Action Cell (`psp-action-cell.tsx`)

- All action buttons already had `aria-label={tooltip}` via the `ActionButton` component; the icons inside are redundant for AT and are now `aria-hidden="true"`.

### Stat Cards (`stat-section.tsx`)

- `StatCard` renders the descriptive `label` as a `<p>` element and the numeric `value` as a separate `<p>`. Icons are purely decorative; `aria-hidden="true"` prevents them from being announced before the label text.

### PSP Dialogs (Activate / Deactivate / Delete)

- All confirmation dialogs use Radix/Base-UI `Dialog` which automatically provides `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (pointing to `DialogTitle`), and `aria-describedby` (pointing to `DialogDescription`). No custom ARIA was needed on the container itself.
- The delete dialog currently contains hardcoded English strings in the warning card and confirmation label. While these strings are not an accessibility violation per se, they should be moved to locale files as part of a future i18n cleanup.

### PSP Create/Edit Dialog (`psp-dialog.tsx`)

- The `<form>` element has `id="psp-dialog-form"` and `aria-label={config.title}` (resolves to "Create New PSP" or "Edit PSP" depending on mode).
- The footer submit button is outside the `<form>` DOM tree (inside `DialogFooter`) but is semantically linked via `form="psp-dialog-form"` and `type="submit"`, enabling native form submission and Enter-key support without an extra `onClick` handler.
- The success state renders a `role="status" aria-live="polite"` region announcing the newly created PSP name to screen readers.

---

## Screen Reader Testing Notes

- **VoiceOver (macOS/iOS):** Table headers announce column name with sort direction when navigating cells. Dialog titles are announced on open. Stat card icons are skipped; label and value are read in sequence.
- **NVDA (Windows):** `aria-busy` on the table causes NVDA to announce "busy" while loading; `aria-live="polite"` region announces the loading text without interrupting the current speech queue.
- **Keyboard-only:** All interactive controls are reachable via Tab. Dialog focus is trapped; Escape closes dialogs. Pagination Previous/Next buttons announce their disabled state correctly.

---

## Known Limitations

- **Delete PSP dialog:** Title, description, warning, and button labels are hardcoded English strings rather than using `next-intl` translation keys. This is an **i18n issue** (not a WCAG violation) — the delete dialog will not localise when the user's locale is not English. Tracked for future cleanup.
