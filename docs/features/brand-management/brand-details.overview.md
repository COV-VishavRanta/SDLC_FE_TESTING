# Brand Details View

## Overview

The **Brand Details View** (`src/app/(protected)/brand-management/[id]`) provides a comprehensive read-only view of a specific Brand. It displays core brand details and a list of associated administrator accounts.

---

## Features

- **Detailed Information:** Displays Brand name, location (Country/State/City), address, website, and contact info.
- **Admin Listing:** Lists all administrators linked to the Brand via `AdminSectionCard`.
- **Status Indicator:** Shows whether the Brand is Active or Inactive via `StatusBadgeCell`.
- **Inline Actions (active brands):** Edit and Deactivate buttons rendered in the page header.
- **Inline Actions (inactive brands):** Activate button rendered in the page header.
- **Responsive Layout:** Two-column layout on desktop; stacked on mobile.
- **Accessibility:** WCAG 2.2 AA compliant.
- **Internationalization:** All labels fully localised.

---

## Architecture

### Components

- **`page.tsx`** (RSC): Decodes the URL-safe ID via `decodeId()`, generates page metadata, wraps content in `SectionErrorBoundary` and `Suspense`.
- **`brand-details-view.tsx`** (`'use client'`): Renders the full details UI. Delegates all state and data fetching to `useBrandDetailsView`. Conditionally renders Edit / Activate / Deactivate buttons based on `brand.isActive`, and mounts `BrandDialog`, `ActivateBrandDialog`, and `DeactivateBrandDialog` inline.
- **`useBrandDetailsView.tsx`** (custom hook): Owns all data-fetching and mutation state for the details page:
  - `useSuspenseQuery(GET_BRAND_DETAILS)` — brand data.
  - `useSuspenseQuery(GET_COUNTRIES)` — fetched in parallel with brand data.
  - `useSuspenseQuery(GET_STATES, skipToken)` — skipped until `brand.countryId` resolves, then fetches states for the brand's country to display the state name.
  - `useMutation(UPDATE_BRAND_STATUS)` — activate/deactivate, with toast notifications.
  - Local `useState` for `isEditOpen`, `isDeactivateOpen`, `isActivateOpen` dialog toggles.
- **`loading.tsx`**: Skeleton screen shown by the `<Suspense>` boundary.

### Data Fetching

`useBrandDetailsView` issues three `useSuspenseQuery` calls:

| Query               | Variables         | Notes                                                  |
| ------------------- | ----------------- | ------------------------------------------------------ |
| `GET_BRAND_DETAILS` | `{ id: brandId }` | Primary brand data                                     |
| `GET_COUNTRIES`     | —                 | Parallel with brand data; used to display country name |
| `GET_STATES`        | `{ countryId }`   | Uses `skipToken` until `brand.countryId` resolves      |

Brand details and country list are fetched in parallel (both `useSuspenseQuery` calls suspend simultaneously). States are fetched in a second pass once the brand's `countryId` is known.

### Internationalization

- Namespace: `brandManagement.details`
- Keys:
  - `title`: Document title.
  - `backLink`: "Back to Brands" link text.
  - `brandInfo`: "Brand Information" section header.
  - `brandAdmins`: "Brand Administrators" section header.
  - `fields.*`: Labels for individual data fields.

---

## Accessibility (508/WCAG)

See [Brand Management 508 Architecture](<../../../src/app/(protected)/brand-management/508.md>) for full audit details.

- **Headings:** Correct `h1` hierarchy for brand name.
- **Icons:** All decorative icons hidden with `aria-hidden="true"`.
- **Back Link:** Standard `<Link>` with visible text and leading icon.
- **Action Buttons:** Buttons have descriptive text labels; no icon-only buttons.
- **Status Badge:** `StatusBadgeCell` conveys active/inactive state visually and textually.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
