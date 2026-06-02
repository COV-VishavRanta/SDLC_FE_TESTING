# Accessibility — User Management Page

## Compliance Target

**WCAG 2.2 Level AA / Section 508 (2017 Refresh)**

---

## Scope

This document covers the accessibility implementation for the **User Management** page and all its child components, including:

- `page.tsx` — main page shell
- `loading.tsx` — streaming skeleton
- `user-table/` — data table with sorting and pagination
- `user-filters/` — search and status filter bar
- `user-creation/` — create-user trigger button
- `activate-deactivate-user/` — activate / deactivate confirmation dialogs
- `delete-user/` — delete-user confirmation dialog
- `impersonate-user/` — impersonate-user read-only dialog
- `resend-invitation-dialog/` — resend invitation confirmation dialog
- `components/dialog/user-dialog/` — shared create / edit user form dialog

---

## Implemented Patterns

| Pattern                     | WCAG SC | Implementation                                                                                                                                                                         |
| --------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title                  | 2.4.2   | `generateMetadata()` exports `"User Management — Pop Logic"` as the document `<title>`                                                                                                 |
| Skip-to-main                | 2.4.1   | Inherited from root layout skip link targeting `#main-content`                                                                                                                         |
| Landmark regions            | 1.3.1   | `PageRoot` renders `<main>`, `PageHeader` renders `<header>`                                                                                                                           |
| Correct button label        | 2.5.3   | Removed incorrect `aria-label='Create PSP'` from create-user button; accessible name now comes from visible button text                                                                |
| Decorative icon hiding      | 1.1.1   | All icons that appear alongside descriptive text carry `aria-hidden="true"` (PlusIcon, PowerIcon, PauseCircleIcon, TrashIcon, SendIcon, InfoCircleIcon, UserIcon, EmailIcon, SortIcon) |
| User avatar accessible name | 1.1.1   | `UserAvatar` renders with `role="img"` and `aria-label="{name} avatar"`; initials span is `aria-hidden="true"`                                                                         |
| Table column headers        | 1.3.1   | All `<TableHead>` cells carry `scope="col"` in both the live table and the loading skeleton                                                                                            |
| Sort state announcement     | 4.1.2   | `<TableHead>` receives `aria-sort="ascending" \| "descending" \| "none"` driven by `header.column.getIsSorted()`                                                                       |
| Loading announcement        | 4.1.3   | `<Table aria-busy={loading}>` marks the grid as busy; a sr-only `aria-live="polite"` region emits a loading message when a query is in flight                                          |
| Form labelling              | 1.3.1   | User dialog `<form>` has `id="user-dialog-form"` and `aria-label={config.title}`                                                                                                       |
| External submit button      | 2.1.1   | Footer submit button uses `form="user-dialog-form"` + `type="submit"` to remain semantically linked to the form even though it is rendered outside the `<form>` element                |
| Form field labels           | 3.3.2   | `FormInputField` and `FormLabel` use `<label htmlFor="id">` throughout the user dialog; impersonate-dialog `ReadOnlyField` upgraded from `<p>` to `<label htmlFor="id">`               |
| Read-only field ids         | 3.3.2   | Impersonate dialog fields use `id="impersonate-full-name"`, `"impersonate-email"`, `"impersonate-role"` paired with their `<label>` elements                                           |
| Dialog title + description  | 4.1.2   | All dialogs use `<DialogTitle>` and `<DialogDescription>` (Radix/Base-UI primitives automatically wire `aria-labelledby` and `aria-describedby` on the dialog container)               |
| Focus trap in dialogs       | 2.1.2   | Radix Dialog implements focus trap; Escape key closes the dialog                                                                                                                       |
| No redundant trigger        | 2.1.1   | Removed empty `<DialogTrigger />` from `ImpersonateUserDialog` (dialog is opened programmatically)                                                                                     |
| Pagination keyboard         | 2.1.1   | Previous / Next pagination buttons are native `<button>` elements; `disabled` state prevents interaction when unavailable                                                              |
| Pagination live region      | 4.1.3   | Pagination summary paragraph carries `aria-live="polite"` so page-change updates are announced                                                                                         |
| Status badge                | 1.4.1   | Status badges combine colour **and** text label — information is never colour-only                                                                                                     |
| Focus indicator             | 2.4.7   | Sortable column buttons carry `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`; all interactive elements inherit global focus ring from Tailwind/shadcn   |
| Target size                 | 2.5.8   | Action icon buttons are `size-10` (40 × 40 px, exceeds 24 px minimum); dialog footer buttons are `h-[47px]`                                                                            |
| Language of page            | 3.1.1   | `<html lang={userLocale}>` set dynamically in root layout                                                                                                                              |

---

## Audit Results

- **Date:** 2026-02-27
- **Grade:** AA Compliant
- **Issues Found:** 15
- **Issues Resolved:** 15

### Issues Resolved

| #   | Severity | WCAG SC | Issue                                                           | File                                        | Fix Applied                                                                                 |
| --- | -------- | ------- | --------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Major    | 2.4.2   | No page-specific `<title>`                                      | `page.tsx`                                  | Added `generateMetadata()`                                                                  |
| 2   | Critical | 2.5.3   | `aria-label='Create PSP'` mismatches visible text               | `user-creation-button.tsx`                  | Removed incorrect aria-label; button text is now the accessible name                        |
| 3   | Major    | 1.1.1   | `<PlusIcon>` not decorative-hidden                              | `user-creation-button.tsx`                  | Added `aria-hidden='true'`                                                                  |
| 4   | Critical | 1.1.1   | `UserAvatar` has no accessible name                             | `user-table-columns.tsx`                    | Added `role="img"` + `aria-label="{name} avatar"`                                           |
| 5   | Major    | 1.1.1   | `<SortIcon>` not decorative-hidden                              | `user-table-columns.tsx`                    | Added `aria-hidden='true'`                                                                  |
| 6   | Critical | 1.3.1   | `<TableHead>` missing `scope="col"`                             | `user-table.tsx` + `user-table.loading.tsx` | Added `scope='col'` to all header cells                                                     |
| 7   | Major    | 4.1.2   | No `aria-sort` on sortable columns                              | `user-table.tsx`                            | Added `aria-sort` derived from `getIsSorted()`                                              |
| 8   | Major    | 4.1.3   | No loading announcement for screen readers                      | `user-table.tsx`                            | Added `aria-busy={loading}` on `<Table>` + sr-only `aria-live="polite"` region              |
| 9   | Major    | 1.1.1   | `<PowerIcon>` not decorative-hidden                             | `activate-user-dialog.tsx`                  | Added `aria-hidden='true'`                                                                  |
| 10  | Major    | 1.1.1   | `<PauseCircleIcon>` not decorative-hidden                       | `deactivate-user-dialog.tsx`                | Added `aria-hidden='true'`                                                                  |
| 11  | Major    | 1.1.1   | `<TrashIcon>` / `<InfoCircleIcon>` not decorative-hidden        | `delete-user-dialog.tsx`                    | Added `aria-hidden='true'` to both                                                          |
| 12  | Major    | 1.1.1   | `<SendIcon>` / `<InfoCircleIcon>` not decorative-hidden         | `resend-invitation-dialog.tsx`              | Added `aria-hidden='true'` to both                                                          |
| 13  | Critical | 3.3.2   | `ReadOnlyField` used `<p>` element as label                     | `impersonate-user-dialog.tsx`               | Replaced with `<label htmlFor>` paired with `Input id`                                      |
| 14  | Minor    | 1.3.1   | Empty `<DialogTrigger />` adds noise                            | `impersonate-user-dialog.tsx`               | Removed; dialog opens programmatically                                                      |
| 15  | Major    | 1.3.1   | Form has no accessible label; external submit button not linked | `user-dialog.tsx`                           | Added `aria-label`, `id="user-dialog-form"`, and `form="user-dialog-form"` on submit button |

---

## Component-Level Notes

### User Table (`user-table.tsx`)

- The `aria-sort` attribute is only set when `header.column.getCanSort()` is `true`, preventing spurious attributes on non-sortable columns (Actions, Status).
- `aria-busy` is data-driven via the `loading` flag from context so screen readers are not left guessing while a query is in flight.

### User Dialogs (Activate / Deactivate / Delete / Resend)

- All confirmation dialogs use Radix/Base-UI `Dialog` which automatically provides `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (pointing to `DialogTitle`), and `aria-describedby` (pointing to `DialogDescription`).
- No custom ARIA was added to the dialog container itself — the primitive handles it.

### Impersonate Dialog (`impersonate-user-dialog.tsx`)

- `ReadOnlyField` now renders a proper `<label>` with `htmlFor` instead of a `<p>` tag. Each field has a stable `id` (`impersonate-full-name`, `impersonate-email`, `impersonate-role`).
- The empty `<DialogTrigger />` was removed because the dialog is driven by local state, not a DOM trigger.

### User Dialog Form (`user-dialog.tsx`)

- The `<form>` element has `id="user-dialog-form"` and `aria-label={config.title}` (e.g., "Create User" or "Edit User").
- The footer submit button is rendered outside the `<form>` (inside `DialogFooter`) but is semantically linked via `form="user-dialog-form"` and `type="submit"`, enabling proper form submission and Enter-key support.

---

## Screen Reader Testing Notes

- **VoiceOver (macOS/iOS):** Dialogs announce title and description on open. Table columns announce sort direction when focus moves to the sort button.
- **NVDA (Windows):** `aria-busy` on the table causes NVDA to announce "busy" while loading; `aria-live="polite"` region announces the loading text without interrupting.
- **Keyboard-only:** All interactive controls are reachable via Tab; dialog focus is trapped; Escape closes dialogs; pagination Previous/Next buttons are focusable and announce disabled state.

---

## Known Limitations

None — all identified issues have been resolved.

---

Last Update:- 06/04/2026
Agent name:- doc-updater
Author:- Vishav Ranta
