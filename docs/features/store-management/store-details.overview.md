# Store Details View

## Overview

The **Store Details View** (`src/app/(protected)/store-management/[id]`) provides a comprehensive read-only view of a specific Store. It displays core store details and a list of associated administrator accounts.

---

## Features

- **Detailed Information:** Displays Store name, store number, phone number, location (Country/State/City), address, and zip code.
- **Admin Listing:** Lists all administrators linked to the Store with their names and email addresses.
- **Status Indicator:** Shows whether the Store is Active or Inactive via a status badge.
- **Responsive Layout:**
  - **Desktop:** Two-column layout (Main Info + Admin sidebar).
  - **Mobile:** Stacked layout for smaller screens.
- **Accessibility:** Fully WCAG 2.2 AA compliant (semantic headings, aria-labels, focus management).
- **Internationalization:** All labels and messages are fully localized.

---

## Architecture

### Components

- **`page.tsx`**: Server Component shell.
  - Decodes the URL-safe ID.
  - sets page metadata (`generateMetadata`).
  - Wraps content in `SectionErrorBoundary` and `Suspense`.
- **`store-details-view.tsx`**: Client Component responsible for rendering.
  - Uses `InfoField` from `@/components` for consistent data display.
  - Consumes logic and state from `useStoreDetailsView`.
- **`useStoreDetailsView.tsx`**: Custom hook managing local component state and data fetching.
  - Fetches data using `useSuspenseQuery` (Apollo Client).
  - Performs parallel data fetching for `GET_STORE_DETAILS` and `GET_COUNTRIES`, and a dependent fetch for `GET_STATES` using `skipToken`.
  - Manages states for Activate, Deactivate, and Edit dialogs.
- **`loading.tsx`**: Skeleton screen displayed while data is being fetched.

### Data Fetching

- **Query:** `GET_STORE_DETAILS`
- **Location Data:** Fetches Countries and States (dependent on Store country) to resolve IDs to names.
- **Parallel Fetching:** Store details and Country list are fetched in parallel for performance.

### Internationalization

- Namespace: `storeManagement.details`
- Keys:
  - `title`: Document title.
  - `backLink`: "Back to Stores" link text.
  - `storeInfo`: "Store Information" section header.
  - `storeAdmins`: "Store Administrators" section header.
  - `fields.*`: Labels for individual data fields.

---

## Accessibility (508/WCAG)

See [Store Management 508 Architecture](<../../../src/app/(protected)/store-management/store-management-508.architecture.md>) for full audit details.

- **Headings:** Correct `h1` -> `h2` hierarchy.
- **Icons:** All decorative icons hidden with `aria-hidden="true"`.
- **Loading:** `aria-busy` and `aria-live` regions used for loading states.
- **Lists:** Admin list explicitly labeled with `aria-label`.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
