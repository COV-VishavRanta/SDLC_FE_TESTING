# User Listing and Filtering

The User Listing and Filtering feature manages how users are displayed, paginated, and filtered on the User Management page (`src/app/(protected)/user-management/page.tsx`).

## Components

### UserTable

Located: `src/app/(protected)/user-management/(components)/user-table/user-table.tsx`

The `UserTable` uses `@tanstack/react-table` to display the `userList`.

**Key Features:**

- **Manual Pagination/Sorting**: All sorting and pagination logic is handled server-side via GraphQL.
- **Role Scoping**: The displayed list is pre-filtered by the logged-in user's role on the backend, ensuring users only see what they are allowed to see.
- **Accessibility**: Includes ARIA headers, sorting announcements, and row count.

### UserFilters

Located: `src/app/(protected)/user-management/(components)/user-filters/user-filters.tsx`

This component is **permission-gated**. Different filters are shown depending on the `currentUserRole` (injected from `UserManagementContext`).

**Filter Logic:**

| Logged-in Role     | Visible Filters                    | Logic                                              |
| :----------------- | :--------------------------------- | :------------------------------------------------- |
| **Platform Admin** | Search, Status, **PSP Dropdown**   | Can filter by any PSP.                             |
| **PSP Admin**      | Search, Status, **Brand Dropdown** | Can filter by Brands associated with their PSP.    |
| **Brand Admin**    | Search, Status, **Store Dropdown** | Can filter by Stores associated with their Brand.  |
| **Store Admin**    | Search, Status                     | Can only search/filter status within their stores. |

**Common Filters:**

- **Search**: Debounced text search (matches name/email).
- **Status**: All (no filter), Active, Inactive, Pending.

## Data Flow (State Management)

The `UserManagementContext` manages the filter state:

```typescript
interface FilterState {
  search: string;
  status: UserStatusEnum | ''; // '' = All (isActive omitted from API call)
  roleId: string; // '__ALL__' or specific ID
  pspId: string; // '__ALL__' or specific ID (Platform Admin only)
  brandId: string; // '__ALL__' or specific ID (PSP Admin only)
  storeId: string; // '__ALL__' or specific ID (Brand Admin only)
}
```

**Context Handlers:**

- `updatePsp(pspId)`: Updates filter and resets pagination.
- `updateBrand(brandId)`: Updates filter and resets pagination.
- `updateStore(storeId)`: Updates filter and resets pagination.

## Accessibility

- **Dropdown Labels**: Each select (PSP, Brand, Store) has an accessible label (`aria-label`).
- **Search Input**: Uses a placeholder and label for screen readers.
- **Filter Reset**: A button to clear all non-search filters to their default state.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
