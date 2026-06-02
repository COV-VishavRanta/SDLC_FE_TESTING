import { gql } from '@apollo/client';

import { PAGINATION_FIELDS } from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// SHIPMENT QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List shipments for a PSP with pagination, filtering, sorting, summary counts, and filter options.
 */
export const LIST_SHIPMENTS = gql`
  query ListShipments(
    $pspId: UUID
    $brandId: UUID
    $storeId: UUID
    $page: Int
    $pageSize: Int
    $filter: ShipmentFilterInput
    $sort: ShipmentSortInput
  ) {
    listShipments(
      pspId: $pspId
      brandId: $brandId
      storeId: $storeId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      shipments {
        shipmentId
        shipmentNumber
        orderNumber
        campaignId
        campaignName
        store {
          id
          name
          stateAbbr
          countryName
        }
        shipmentEta
        trackingNumber
        carrierName
        status
        totalItems
        distinctPromotions
      }
      pagination {
        ...PaginationFields
      }
      summary {
        totalShipments
        received
        shipped
        receivedWithException
      }
      filterOptions {
        campaigns {
          id
          name
        }
        stores {
          id
          name
        }
      }
    }
  }
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full details for a single shipment by ID.
 * Returns campaign, store, shipment date, estimated delivery, tracking number, status, notes,
 * and a paginated promotions table with search and sort.
 * Accessible by PSP Admin and Production Operator roles.
 */
export const GET_SHIPMENT_DETAILS = gql`
  query GetShipmentDetails(
    $shipmentNumber: Int!
    $itemsPage: Int
    $itemsPageSize: Int
    $itemsSearch: String
    $itemsSortOrder: String
  ) {
    getShipmentDetails(
      shipmentNumber: $shipmentNumber
      itemsPage: $itemsPage
      itemsPageSize: $itemsPageSize
      itemsSearch: $itemsSearch
      itemsSortOrder: $itemsSortOrder
    ) {
      success
      message
      shipment {
        id
        shipmentNumber
        orderNumber
        campaignName
        store {
          name
          countryName
          stateAbbr
        }
        shipmentDate
        estimatedDelivery
        trackingNumber
        carrierName
        status
        notes
        items {
          shipmentItemId
          promotionName
          quantityShipped
          receivedQuantity
          exceptionType
        }
        itemsPagination {
          ...PaginationFields
        }
        totalItems
        totalPromotions
      }
    }
  }
  ${PAGINATION_FIELDS}
`;

// ─────────────────────────────────────────────────────────────────────────────
// EXCEPTION REQUEST QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List exception requests (shipment reorders) with pagination, filtering, sorting, and status counts.
 */
export const LIST_EXCEPTION_REQUESTS = gql`
  query ListExceptionRequests(
    $brandId: UUID
    $storeId: UUID
    $page: Int
    $pageSize: Int
    $filter: ExceptionRequestFilterInput
    $sort: ExceptionRequestSortInput
  ) {
    listExceptionRequests(
      brandId: $brandId
      storeId: $storeId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      exceptionRequests {
        id
        reorderId
        issueNumber
        shipmentNumber
        orderNumber
        campaignId
        campaignName
        storeName
        submittedDate
        submittedBy
        totalQuantity
        status
        canApprove
        canReject
        canCancel
        canUpdate
      }
      pagination {
        ...PaginationFields
      }
      statusCounts {
        pendingApproval
        approved
        rejected
        cancelled
        total
      }
      filterOptions {
        campaigns {
          id
          name
        }
        stores {
          id
          name
        }
      }
    }
  }
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full details for a single exception request by ID.
 */
export const GET_EXCEPTION_REQUEST_DETAILS = gql`
  query GetExceptionRequestDetails($reorderId: UUID!) {
    getExceptionRequestDetails(reorderId: $reorderId) {
      success
      message
      exceptionRequest {
        id
        shipmentId
        shipmentNumber
        storeInfo {
          storeName
          storeAdminName
          address
          contactNumber
        }
        campaignName
        orderNumber
        submittedBy
        submittedDate
        status
        reason
        actionReason
        campaignManagerId
        canApprove
        canReject
        canCancel
        canUpdate
        items {
          id
          promotionName
          size
          material
          originalQuantity
          requestedQuantity
          exceptionType
        }
        images {
          id
          name
          url
          type
        }
      }
    }
  }
`;
