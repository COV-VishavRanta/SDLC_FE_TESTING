import { gql } from '@apollo/client';

import {
  CAMPAIGN_CORE_FIELDS,
  PAGINATION_FIELDS,
  PROMOTION_CORE_FIELDS,
  STORE_DISTRIBUTION_ITEM_FIELDS,
} from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch full details of a single Campaign by ID
 */
export const GET_CAMPAIGN = gql`
  query GetCampaign($campaignId: UUID!) {
    campaign(campaignId: $campaignId) {
      success
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;

/**
 * List campaigns for a brand with pagination, filtering, and sorting.
 * Brand Admins see all non-archived campaigns; Campaign Managers see only assigned ones.
 */
export const LIST_CAMPAIGNS = gql`
  query ListCampaigns(
    $brandId: UUID
    $pspId: UUID
    $storeId: UUID
    $page: Int
    $pageSize: Int
    $filter: CampaignFilterInput
    $sort: CampaignSortInput
  ) {
    listCampaigns(
      brandId: $brandId
      pspId: $pspId
      storeId: $storeId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      campaigns {
        ...CampaignCoreFields
      }
      pagination {
        ...PaginationFields
      }
      statusCounts {
        newCampaigns
        inReview
        inProduction
        total
      }
      stores {
        id
        name
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * List all active Campaign Manager users for a specific brand.
 * Allowed for Brand Admin only.
 */
export const GET_CAMPAIGN_MANAGERS_BY_BRAND = gql`
  query GetCampaignManagersByBrand($brandId: UUID!) {
    getCampaignManagersByBrand(brandId: $brandId) {
      id
      name
      email
    }
  }
`;

/**
 * Fetch a single store order for a campaign by order number.
 * Returns the full store order detail including per-promotion breakdown.
 */
export const GET_CAMPAIGN_STORE_ORDER = gql`
  query GetCampaignStoreOrder($campaignId: UUID!, $orderNumber: Int!) {
    campaignStoreOrder(campaignId: $campaignId, orderNumber: $orderNumber) {
      success
      message
      storeOrder {
        storeId
        storeName
        orderNumber
        totalPromotions
        totalQuantity
        shippedQuantity
        remainingQuantity
        orderStatus
        isReorder
        parentOrderNumber
        orderItems {
          orderItemId
          orderId
          orderNumber
          promotionId
          promotionName
          height
          width
          specifications
          totalQuantity
          shippedQuantity
          remainingQuantity
          installationStatus
          installationRejectionReason
          installationImageUrls
          installationNotes
        }
      }
    }
  }
`;

/**
 * Fetch all store orders for a campaign, grouped by store.
 * Each store entry includes totals for promotions, quantity, shipped, and remaining,
 * along with a per-promotion breakdown.
 */
export const GET_CAMPAIGN_STORE_ORDERS = gql`
  query GetCampaignStoreOrders($campaignId: UUID!, $storeId: UUID) {
    campaignStoreOrders(campaignId: $campaignId, storeId: $storeId) {
      success
      message
      stores {
        storeId
        storeName
        orderNumber
        totalPromotions
        totalQuantity
        shippedQuantity
        remainingQuantity
        orderStatus
        isReorder
        isReorderOfReorder
        parentOrderNumber
        orderItems {
          orderItemId
          orderId
          orderNumber
          promotionId
          promotionName
          height
          width
          specifications
          totalQuantity
          shippedQuantity
          receivedQuantity
          remainingQuantity
          installationStatus
          installationRejectionReason
          discrepancyQuantity
          installationImageUrls
          installationNotes
        }
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List promotions for a campaign with optional pagination and sorting.
 * Pass pageSize=-1 to fetch all records without pagination.
 */
export const GET_PROMOTIONS_BY_CAMPAIGN = gql`
  query GetPromotionsByCampaign(
    $campaignId: UUID!
    $page: Int
    $pageSize: Int
    $storeId: UUID
    $sortOrder: SortOrder
    $search: String
  ) {
    promotionsByCampaign(
      campaignId: $campaignId
      page: $page
      pageSize: $pageSize
      storeId: $storeId
      sortOrder: $sortOrder
      search: $search
    ) {
      success
      message
      promotions {
        ...PromotionCoreFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${PROMOTION_CORE_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full detail of a single promotion including images (with a hasImages flag)
 * and the store distribution for that promotion.
 * Only Brand Admins and Campaign Managers may access this query.
 */
export const GET_PROMOTION_DETAIL = gql`
  query GetPromotionDetail($promotionId: UUID!, $storeId: UUID) {
    promotionDetail(promotionId: $promotionId, storeId: $storeId) {
      success
      message
      promotion {
        ...PromotionCoreFields
      }
      hasImages
      storeDistributions {
        ...StoreDistributionItemFields
      }
      totalDistributedQuantity
    }
  }
  ${PROMOTION_CORE_FIELDS}
  ${STORE_DISTRIBUTION_ITEM_FIELDS}
`;

// ─────────────────────────────────────────────────────────────────────────────
// STORE DISTRIBUTION QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the store distribution for a specific promotion.
 * Returns each store and the total quantity assigned to it via order items.
 * Intended for the Edit view of store distribution.
 */
export const GET_STORE_DISTRIBUTION_BY_PROMOTION = gql`
  query GetStoreDistributionByPromotion($promotionId: UUID!) {
    storeDistributionByPromotion(promotionId: $promotionId) {
      success
      promotionId
      promotionName
      items {
        ...StoreDistributionItemFields
      }
      totalDistributedQuantity
    }
  }
  ${STORE_DISTRIBUTION_ITEM_FIELDS}
`;
