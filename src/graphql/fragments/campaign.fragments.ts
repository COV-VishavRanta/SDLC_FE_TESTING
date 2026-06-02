import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const CAMPAIGN_MANAGER_FIELDS = gql`
  fragment CampaignManagerFields on CampaignManagerInfo {
    id
    name
    email
  }
`;

/**
 * Core campaign fields used in list and detail views.
 */
export const CAMPAIGN_CORE_FIELDS = gql`
  fragment CampaignCoreFields on CampaignType {
    id
    pspId
    brandId
    name
    objective
    description
    startDate
    endDate
    shipByDate
    campaignManagerId
    campaignManager {
      ...CampaignManagerFields
    }
    isPermanent
    status
    isArchived
    createdBy
    createdAt
    brandName
    pspName
    storeCount
    promotionCount
    totalQuantity
  }
  ${CAMPAIGN_MANAGER_FIELDS}
`;

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core promotion image fields.
 */
export const PROMOTION_IMAGE_FIELDS = gql`
  fragment PromotionImageFields on PromotionImageType {
    id
    campaignPromotionId
    name
    type
    key
    url
    isPrimary
    createdBy
    createdAt
  }
`;

/**
 * Core promotion fields used in list and detail views.
 */
export const PROMOTION_CORE_FIELDS = gql`
  fragment PromotionCoreFields on PromotionType {
    id
    campaignId
    name
    width
    height
    material
    specifications
    description
    needDesign
    isReusable
    isImported
    isCreatedFromInventory
    createdFromInventoryId
    images {
      ...PromotionImageFields
    }
    storeCount
    totalDistributedQty
    createdBy
    createdAt
  }
  ${PROMOTION_IMAGE_FIELDS}
`;

// ─────────────────────────────────────────────────────────────────────────────
// STORE DISTRIBUTION FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fields for a single store distribution item (store + assigned quantity).
 * Used in both storeDistributionByPromotion and promotionDetail queries.
 */
export const STORE_DISTRIBUTION_ITEM_FIELDS = gql`
  fragment StoreDistributionItemFields on StoreDistributionItemType {
    storeId
    storeName
    orderItemId
    storeNumber
    assignedQuantity
  }
`;
