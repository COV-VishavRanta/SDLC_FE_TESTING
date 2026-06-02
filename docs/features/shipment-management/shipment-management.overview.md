# Shipment Management — Overview

The Shipment Management module provides read-only visibility into physical shipments of promotional materials (POPs) from fulfillment centers to retail stores. Users can browse all shipments with filters and sorting, and drill into a single shipment to see its promotion-level breakdown.

## Routes

| Route             | Component                  | Description                                                  |
| ----------------- | -------------------------- | ------------------------------------------------------------ |
| `/shipments`      | `ShipmentsPage` (RSC)      | Paginated list of all shipments                              |
| `/shipments/[id]` | `ShipmentDetailPage` (RSC) | Details for a single shipment identified by `shipmentNumber` |

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ShipmentsPage  (RSC — app/(protected)/shipments/page.tsx)                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  ShipmentProvider  (Client Context)                                     │ │
│  │                                                                         │ │
│  │   ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐ │ │
│  │   │ ShipmentStatCards │  │  ShipmentFilters  │  │  ShipmentTable     │ │ │
│  │   │    (Client)       │  │    (Client)       │  │    (Client)        │ │ │
│  │   └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬──────────┘ │ │
│  │             │                      │                       │            │ │
│  │             └──────────────────────┴───────────────────────┘            │ │
│  │                                    │                                    │ │
│  │                           ShipmentContext                               │ │
│  │       (filterState · sorting · pagination · Apollo SuspenseQuery)       │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                     Apollo: LIST_SHIPMENTS query
                                     │
                                     ▼
                      ┌──────────────────────────┐
                      │   FastAPI GraphQL Backend │
                      └──────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│  ShipmentDetailPage  (RSC — app/(protected)/shipments/[id]/page.tsx)         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  ShipmentDetailsProvider  (Client Context)                              │ │
│  │                                                                         │ │
│  │   ┌──────────────────────┐  ┌──────────────────────────────────────┐   │ │
│  │   │ ShipmentDetailHeader │  │  ShipmentInfoSection                 │   │ │
│  │   │     (Client)         │  │     (Client)                         │   │ │
│  │   └──────────────────────┘  └──────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │   ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │   │  ShipmentDetailPromotionTable  (Client)                         │   │ │
│  │   └─────────────────────────────────────────────────────────────────┘   │ │
│  │                        ShipmentDetailsContext                           │ │
│  │           (pagination · sortOrder · Apollo SuspenseQuery)               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                     Apollo: GET_SHIPMENT_DETAILS query
                                     │
                                     ▼
                      ┌──────────────────────────┐
                      │   FastAPI GraphQL Backend │
                      └──────────────────────────┘
```

## Role-Based Entity Scoping

The `ShipmentProvider` reads the current user's role from `GlobalProtectedContext` and derives the correct entity ID to scope data at the API level.

| Role          | Variable sent to `LIST_SHIPMENTS` |
| ------------- | --------------------------------- |
| `PSP_ADMIN`   | `pspId`                           |
| `BRAND_ADMIN` | `brandId`                         |
| `STORE_ADMIN` | `storeId`                         |

## GraphQL Queries

| Query                  | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `LIST_SHIPMENTS`       | Paginated shipment list + summary counts + filter options              |
| `GET_SHIPMENT_DETAILS` | Full details for a single shipment including paginated promotion items |

## Key Types

| Type                    | File                                         | Description                                          |
| ----------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `ShipmentListItemType`  | `graphql/queries/shipment/shipment.types.ts` | Row shape for the listing table                      |
| `ShipmentDetailType`    | `graphql/queries/shipment/shipment.types.ts` | Full shipment detail, including items                |
| `ShipmentSummary`       | `graphql/queries/shipment/shipment.types.ts` | Stat card counts (totalShipments, shipped, received) |
| `ShipmentFilterOptions` | `graphql/queries/shipment/shipment.types.ts` | Dynamic campaign/store dropdown options from the API |

## Shipment Status Variants

| Status                   | Badge Variant      |
| ------------------------ | ------------------ |
| `shipped`                | `pending` (amber)  |
| `delivered` / `received` | `active` (green)   |
| `pending`                | `warning` (yellow) |
| other                    | `inactive` (gray)  |

## Sub-Feature Docs

- [Shipment Listing & Filtering](./shipment-listing-filtering.md)
- [Shipment Details](./shipment-details.md)

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
