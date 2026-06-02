import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core inventory image fields.
 */
export const INVENTORY_IMAGE_FIELDS = gql`
  fragment InventoryImageFields on InventoryImageType {
    id
    inventoryId
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
 * Core inventory fields used in list and detail views.
 */
export const INVENTORY_CORE_FIELDS = gql`
  fragment InventoryCoreFields on InventoryType {
    id
    brandId
    pspId
    name
    quantity
    width
    height
    material
    specifications
    description
    notes
    createdBy
    createdAt
    brandName
    inActiveCampaign
    images {
      ...InventoryImageFields
    }
  }
  ${INVENTORY_IMAGE_FIELDS}
`;
