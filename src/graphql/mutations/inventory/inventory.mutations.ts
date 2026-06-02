import { gql } from '@apollo/client';

import { INVENTORY_CORE_FIELDS } from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new Inventory item.
 */
export const CREATE_INVENTORY = gql`
  mutation CreateInventory($input: CreateInventoryInput!) {
    createInventory(input: $input) {
      success
      message
      inventory {
        ...InventoryCoreFields
      }
    }
  }
  ${INVENTORY_CORE_FIELDS}
`;

/**
 * Update an existing Inventory item.
 */
export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($input: UpdateInventoryInput!) {
    updateInventory(input: $input) {
      success
      message
      inventory {
        ...InventoryCoreFields
      }
    }
  }
  ${INVENTORY_CORE_FIELDS}
`;

/**
 * Delete an Inventory item.
 */
export const DELETE_INVENTORY = gql`
  mutation DeleteInventory($inventoryId: UUID!) {
    deleteInventory(inventoryId: $inventoryId) {
      success
      message
    }
  }
`;

/**
 * Generate a presigned S3 URL for uploading an inventory image.
 */
export const GENERATE_INVENTORY_UPLOAD_URL = gql`
  mutation GenerateInventoryUploadUrl($input: GenerateInventoryUploadUrlInput!) {
    generateInventoryUploadUrl(input: $input) {
      success
      message
      uploadUrl
      fileKey
    }
  }
`;
