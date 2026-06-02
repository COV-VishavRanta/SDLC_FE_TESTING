import { InventoryFilterInput, InventorySortInput, InventoryType, PaginationInfo } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------LIST INVENTORY-----------------
*/

export interface ListInventoryVariables {
  pspId: string;
  page?: number;
  pageSize?: number;
  filter?: InventoryFilterInput;
  sort?: InventorySortInput;
}

export interface ListInventoryResponse {
  listInventory: {
    success: boolean;
    message: string;
    inventoryItems: InventoryType[];
    pagination?: PaginationInfo;
  };
}
