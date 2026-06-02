# Accessibility — Audit Logs Page

## Compliance Target

WCAG 2.2 Level AA / Section 508 (2017 Refresh)

## Implemented Patterns

| Pattern                    | WCAG SC | Implementation                                                                                                                                                            |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title                 | 2.4.2   | `generateMetadata()` in `page.tsx` returns translated `title` via `getTranslations('auditLogs.page')`                                                                     |
| Table column headers       | 1.3.1   | `scope="col"` on every `<TableHead>` in both `log-listing.tsx` and `log-table.loading.tsx`                                                                                |
| Loading state announcement | 4.1.3   | `aria-live="polite" aria-atomic="true"` sr-only region in `log-listing.tsx` using `t('listing.loadingState')`                                                             |
| `aria-busy` on table       | 4.1.2   | `<Table aria-busy={loading}>` informs AT content is updating during data fetch                                                                                            |
| Row header semantics       | 1.3.1   | `<th scope="row">` in `helper.tsx` key-value table inside `JsonValueDisplay`                                                                                              |
| Unique column headers      | 2.4.6   | Details column header now uses `t('columns.details')` (sr-only), eliminating duplicate "ACTION" label                                                                     |
| Decorative icon — Eye      | 1.1.1   | `<EyeIcon aria-hidden="true">` — `ActionButton`'s `tooltip` prop supplies the accessible name                                                                             |
| Decorative icon — Refresh  | 1.1.1   | `<RefreshIcon aria-hidden="true">` in reset button — button text "Reset" is the accessible label                                                                          |
| Decorative icon — User     | 1.1.1   | `<UserIcon aria-hidden="true">` in `change-details-dialog.tsx` — adjacent text is the accessible content                                                                  |
| Decorative icon — Clock    | 1.1.1   | `<ClockIcon aria-hidden="true">` in `change-details-dialog.tsx` — adjacent text is the accessible content                                                                 |
| Keyboard-operable trigger  | 2.1.1   | `change-details-dialog.tsx` replaced `<div onClick>` wrapper with `React.cloneElement` to attach `onClick` directly to the trigger button, preserving keyboard activation |
| Loading skeleton headers   | 1.3.1   | `log-table.loading.tsx` adds `scope="col"` + sr-only "Details" text on the empty icon-column header                                                                       |

## Translation Keys Added

All three locales (`en`, `es`, `fr`) received:

| Key path                          | Purpose                                             |
| --------------------------------- | --------------------------------------------------- |
| `auditLogs.listing.loadingState`  | Announced by the `aria-live` region during loading  |
| `auditLogs.table.columns.details` | Accessible header label for the details icon column |

## Audit Results

- **Date:** 2025-07-25
- **Grade:** AA Compliant
- **Issues Found:** 13
- **Issues Resolved:** 13

### Issues Fixed

| #   | Severity | WCAG SC | Issue                                                           | File                        |
| --- | -------- | ------- | --------------------------------------------------------------- | --------------------------- |
| 1   | Major    | 2.4.2   | No page `<title>` / `generateMetadata()`                        | `page.tsx`                  |
| 2   | Critical | 1.3.1   | `<TableHead>` missing `scope="col"` on all columns              | `log-listing.tsx`           |
| 3   | Major    | 4.1.2   | `<Table>` missing `aria-busy` during data fetch                 | `log-listing.tsx`           |
| 4   | Major    | 4.1.3   | No `aria-live` region announcing loading state                  | `log-listing.tsx`           |
| 5   | Critical | 1.3.1   | `<TableHead>` missing `scope="col"` in loading skeleton         | `log-table.loading.tsx`     |
| 6   | Major    | 1.3.1   | Empty header cell for details column with no sr-only label      | `log-table.loading.tsx`     |
| 7   | Major    | 2.4.6   | Details column used duplicate "ACTION" header label             | `log-table-columns.tsx`     |
| 8   | Minor    | 1.1.1   | `<EyeIcon>` not `aria-hidden`                                   | `log-table-columns.tsx`     |
| 9   | Minor    | 1.1.1   | `<RefreshIcon>` not `aria-hidden`                               | `log-filters.tsx`           |
| 10  | Minor    | 1.1.1   | `<UserIcon>` not `aria-hidden`                                  | `change-details-dialog.tsx` |
| 11  | Minor    | 1.1.1   | `<ClockIcon>` not `aria-hidden`                                 | `change-details-dialog.tsx` |
| 12  | Critical | 2.1.1   | Trigger wrapped in `<div onClick>` breaking keyboard access     | `change-details-dialog.tsx` |
| 13  | Critical | 1.3.1   | Key-value row headers used `<td>` instead of `<th scope="row">` | `helper.tsx`                |

## Screen Reader Testing Notes

- The `aria-live="polite"` region in `log-listing.tsx` announces when table data is loading/loaded. This pairs with `aria-busy` on the table so AT users know not to interact during updates.
- The `React.cloneElement` pattern in `change-details-dialog.tsx` ensures the trigger element (an `<ActionButton>`) retains its native button semantics and keyboard event handling. Previously wrapping in `<div onClick>` meant pressing Enter/Space on the button would not have propagated through to open the dialog in all AT configurations.
- The `<th scope="row">` change in `helper.tsx` allows screen readers to associate attribute names with their values in the before/after JSON diff tables — critical for interpreting change sets read aloud.

## Known Limitations

None. All identified issues have been resolved.

---

Last Update:- 06/04/2026
Agent name:- doc-updater
Author:- Vishav Ranta
