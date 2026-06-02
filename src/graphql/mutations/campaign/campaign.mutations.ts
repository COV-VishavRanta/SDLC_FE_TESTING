import { gql } from '@apollo/client';

import { CAMPAIGN_CORE_FIELDS, PROMOTION_CORE_FIELDS } from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new Campaign (saved as DRAFT)
 */
export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      success
      message
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;

/**
 * Update an existing Campaign's details
 */
export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($input: UpdateCampaignInput!) {
    updateCampaign(input: $input) {
      success
      message
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;

/**
 * Archive or unarchive a Campaign.
 * Archiving requires the campaign to be in COMPLETED status.
 */
export const ARCHIVE_CAMPAIGN = gql`
  mutation ArchiveCampaign($input: ArchiveCampaignInput!) {
    archiveCampaign(input: $input) {
      success
      message
      campaign {
        id
        name
        status
        isArchived
      }
    }
  }
`;

/**
 * Permanently delete a DRAFT Campaign and all its related data.
 */
export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($input: DeleteCampaignInput!) {
    deleteCampaign(input: $input) {
      success
      message
    }
  }
`;

/**
 * Submit a DRAFT campaign to the PSP, transitioning its status to NEW.
 */
export const SUBMIT_CAMPAIGN = gql`
  mutation SubmitCampaign($input: SubmitCampaignInput!) {
    submitCampaign(input: $input) {
      success
      message
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new Promotion for a Campaign.
 */
export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      success
      message
      promotion {
        ...PromotionCoreFields
      }
    }
  }
  ${PROMOTION_CORE_FIELDS}
`;

/**
 * Update an existing Promotion.
 */
export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($input: UpdatePromotionInput!) {
    updatePromotion(input: $input) {
      success
      message
      promotion {
        ...PromotionCoreFields
      }
    }
  }
  ${PROMOTION_CORE_FIELDS}
`;

/**
 * Delete a Promotion and all its images.
 */
export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($promotionId: UUID!) {
    deletePromotion(promotionId: $promotionId) {
      success
      message
    }
  }
`;

/**
 * Bulk-create Promotions from a list of Inventory IDs.
 * Fields and images are copied from each inventory item.
 */
export const CREATE_PROMOTIONS_FROM_INVENTORY = gql`
  mutation CreatePromotionsFromInventory($input: CreatePromotionsFromInventoryInput!) {
    createPromotionsFromInventory(input: $input) {
      success
      message
      promotions {
        ...PromotionCoreFields
      }
    }
  }
  ${PROMOTION_CORE_FIELDS}
`;

/**
 * Generate a presigned S3 URL for uploading a promotion image.
 */
export const GENERATE_PROMOTION_UPLOAD_URL = gql`
  mutation GeneratePromotionUploadUrl($input: GeneratePromotionUploadUrlInput!) {
    generatePromotionUploadUrl(input: $input) {
      success
      message
      uploadUrl
      fileKey
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// STORE DISTRIBUTION MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Distribute a promotion's quantity across multiple stores of the brand.
 * Creates a DRAFT order per store (or reuses an existing one) and records
 * an order item with the assigned quantity.
 */
export const DISTRIBUTE_PROMOTIONS_TO_STORES = gql`
  mutation DistributePromotionsToStores($input: DistributePromotionsToStoresInput!) {
    distributePromotionsToStores(input: $input) {
      success
      message
      results {
        storeId
        storeName
        orderId
        orderNumber
        orderItemId
        quantity
      }
    }
  }
`;

/**
 * Self-assign the current Campaign Manager to an unassigned campaign.
 */
export const ASSIGN_CAMPAIGN_MANAGER = gql`
  mutation AssignCampaignManager($input: AssignCampaignManagerInput!) {
    assignCampaignManager(input: $input) {
      success
      message
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;

/**
 * Import promotions from a source campaign into a target campaign.
 * COPY mode adds imported promotions alongside existing ones.
 * REPLACE mode deletes all existing promotions in the target campaign first.
 * Both campaigns must belong to the same brand.
 */
export const IMPORT_PROMOTIONS = gql`
  mutation ImportPromotions($input: ImportPromotionsInput!) {
    importPromotions(input: $input) {
      success
      message
      promotions {
        ...PromotionCoreFields
      }
    }
  }
  ${PROMOTION_CORE_FIELDS}
`;

/**
 * Change the status of a campaign. Role-based transition rules are enforced.
 */
export const CHANGE_CAMPAIGN_STATUS = gql`
  mutation ChangeCampaignStatus($input: ChangeCampaignStatusInput!) {
    changeCampaignStatus(input: $input) {
      success
      message
      campaign {
        ...CampaignCoreFields
      }
    }
  }
  ${CAMPAIGN_CORE_FIELDS}
`;
