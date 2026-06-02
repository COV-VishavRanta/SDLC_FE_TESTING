# Store Management

This folder contains the Store Management page and its components.

## Folder Structure

```
store-management/
├── (components)/
│   ├── store-stats/       # Statistics cards for stores
│   ├── store-filters/     # Search and filter components
│   ├── store-table/       # Table with store data
│   └── store-dialogs/     # Dialog components for CRUD operations
├── context/
│   ├── StoreManagementContext.tsx
│   └── mock-data.ts
├── page.tsx               # Main store management page
└── README.md
```

## Components

### StoreStats

Displays three statistics cards:

- **Total Stores**: Count of all stores
- **Active**: Count of active stores
- **Inactive**: Count of inactive stores

### StoreFilters

Provides filtering and search capabilities:

- Search input with icon
- Status filter dropdown (All Stores, Active, Inactive)
- Reset button

### StoreTable

Data table showing:

- Store Name (with email)
- Store Number
- Location (with zip code)
- Store Admins
- Status badge
- Action buttons (Edit, Delete/Activate)

## Design Notes

- Uses global CSS variables for colors and styling consistency
- Fully responsive design with mobile-first approach
- Pixel-perfect implementation matching Figma design
- Follows project conventions and architecture patterns
- Uses shadcn/ui components for form elements and tables
- Icon components from `/components/icons/`

## Features

- ✅ Responsive design (mobile to desktop)
- ✅ Search functionality
- ✅ Status filtering
- ✅ Sortable table columns
- ✅ Pagination
- ✅ Status badges with icons
- ✅ Action buttons (Edit, Delete)

## Usage

Navigate to `/store-management` to access the Store Management page.
