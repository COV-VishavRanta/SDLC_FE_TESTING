# Order Shipment

## Overview

The Order Shipment capability isolates logistics and shipping for specific store-bound orders triggered by a Campaign. It is accessible to users with fulfilment authority (PSP Admin and Production Operator).

## Architecture

The target path is:
`/campaign-management/[id]/[orderNumber]/order-shipment`

- `[id]` is an encoded campaign ID — decoded with `decodeId()`.
- `[orderNumber]` is a numeric order number — parsed with `Number()` and validated (`isNaN`, `<= 0` → `notFound()`).
- An optional `?from=reorder` query param controls which tab the user is redirected to after successful shipment creation.

```mermaid
flowchart TD
    OrdersTab["Orders / Reorders Tab\n(StoreOrderCard with Ship button)"]
    OrdersTab --> |Click ship button| ShipmentPage["Order Shipment Route\n/[id]/[orderNumber]/order-shipment?from=order|reorder"]

    ShipmentPage --> Guard["CampaignSubPageGuard\n(SHIP_ORDERS)"]
    Guard --> |canShipOrders=true| Provider["OrderShipmentProvider (Client Context)"]
    Guard --> |canShipOrders=false| Redirect["Redirect → /campaign-management"]

    Provider --> Header["OrderShipmentHeader"]
    Provider --> Form["OrderShipmentForm"]

    Provider --> Hook["useOrderShipmentClient Hook"]
    Hook --> |GET_CAMPAIGN| CampaignData["Campaign Name (cache-first)"]
    Hook --> |GET_CAMPAIGN_STORE_ORDER\n(network-only)| StoreOrders["Order Items per Store"]
    Hook --> |CREATE_SHIPMENT mutation| Apollo["Apollo Client"]

    Form -.-> |Validates via zod + react-hook-form| Schema["order-shipment.schema.ts\n(shipmentSchema + SortDir type)"]
```

## Context: OrderShipmentProvider

The page wraps its content in `OrderShipmentProvider`, which delegates all logic to `useOrderShipmentClient`. The context exposes:

| Value                              | Type                     | Source                                        |
| ---------------------------------- | ------------------------ | --------------------------------------------- |
| `campaignName`                     | `string`                 | `GET_CAMPAIGN` (cache-first)                  |
| `storeName`                        | `string`                 | `GET_CAMPAIGN_STORE_ORDER`                    |
| `orderItems`                       | `OrderItemType[]`        | `GET_CAMPAIGN_STORE_ORDER` (network-only)     |
| `quantities`                       | `Record<string, string>` | Local state — per-item ship qty               |
| `form` (register, control, errors) | React Hook Form          | Zod-validated                                 |
| `sorting` / `pagination`           | TanStack Table state     | Client-side table                             |
| `handleSearch` / `searchQuery`     | Column filter            | Search by promotion name                      |
| `hasAnyShipQty`                    | `boolean`                | Derived — at least one item has qty > 0       |
| `hasAnyRemainingQty`               | `boolean`                | Derived — at least one item has remaining qty |
| `onSubmit`                         | `(values) => Promise`    | Creates shipment with selected items          |
| `onShipAllItems`                   | `(values) => Promise`    | Creates shipment with all remaining items     |

## Data Fetching Strategy

| Query / Mutation           | Fetch Policy   | Purpose                                      |
| -------------------------- | -------------- | -------------------------------------------- |
| `GET_CAMPAIGN`             | `cache-first`  | Campaign name for the page header            |
| `GET_CAMPAIGN_STORE_ORDER` | `network-only` | Always-fresh order items to avoid stale data |
| `CREATE_SHIPMENT`          | mutation       | Submit the shipment form                     |

## Form Validation (Zod)

The `createShipmentSchema` factory function takes `next-intl` translations and produces a Zod schema:

| Field            | Validation                                                       |
| ---------------- | ---------------------------------------------------------------- |
| `trackingNumber` | Min/max length from `VALIDATION_LENGTH.SHIPMENT.TRACKING_NUMBER` |
| `carrierName`    | Min/max length from `VALIDATION_LENGTH.SHIPMENT.CARRIER_NAME`    |
| `eta`            | Required, must be a future date (> today)                        |
| `notes`          | Optional, max length from `VALIDATION_LENGTH.SHIPMENT.NOTES`     |

Form is managed via `react-hook-form` with `zodResolver`.

## Quantity Management

- On data load, all order items are initialised with quantity `'0'`.
- `handleQuantityChange(orderItemId, value, maxQty)` clamps the input to `[0, maxQty]`.
- `handleClearAll()` resets all quantities to `'0'`.
- Two submit modes:
  - **Ship Selected**: `onSubmit` — only items with `qty > 0` are included.
  - **Ship All**: `onShipAllItems` — all items with `remainingQuantity > 0` are shipped at full remaining qty.

## Post-Mutation Redirect

On successful shipment creation, the user is redirected to:

```
/campaign-management/{encodedCampaignId}?tab={redirectTab}
```

Where `redirectTab` is `'order'` or `'reorder'` based on the `?from=` query param passed when navigating to the shipment page.

## Security & Isolation

- **Route Guarding:** Protected by `CampaignSubPageGuard` with `campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.SHIP_ORDERS}`. The guard internally checks the `canShipOrders` capability (PSP Admin and Production Operator only). For Campaign Managers, ownership is also verified.
- **Client Schema Validation:** All shipping forms are structurally verified through Zod definitions to guarantee proper tracking and date formats before the Apollo mutation fires.
- **Server-side ID Validation:** Both `[id]` and `[orderNumber]` are validated server-side in the RSC page; invalid values trigger `notFound()`.

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
