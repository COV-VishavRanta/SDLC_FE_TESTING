import { gql } from '@apollo/client';

import { INVENTORY_CORE_FIELDS, PAGINATION_FIELDS } from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List inventory items for a PSP with pagination, filtering, sorting, and search.
 * Pass pageSize=-1 to fetch all records without pagination.
 * Permitted role: PSP Admin.
 */
export const LIST_INVENTORY = gql`
  query ListInventory(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: InventoryFilterInput
    $sort: InventorySortInput
  ) {
    listInventory(pspId: $pspId, page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      success
      message
      inventoryItems {
        ...InventoryCoreFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${INVENTORY_CORE_FIELDS}
  ${PAGINATION_FIELDS}
`;
