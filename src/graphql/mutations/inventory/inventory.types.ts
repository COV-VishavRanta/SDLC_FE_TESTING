import { InventoryType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY MUTATIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryImageInput {
  name: string;
  type: string;
  key: string;
  isPrimary: boolean;
}

/*
-----------------CREATE INVENTORY-----------------
*/

export interface CreateInventoryInput {
  pspId: string;
  brandId: string;
  name: string;
  quantity: number;
  width: number;
  height: number;
  material?: string;
  specifications?: string;
  description?: string;
  notes?: string;
  images: InventoryImageInput[];
}

export interface CreateInventoryVariables {
  input: CreateInventoryInput;
}

export interface CreateInventoryResponse {
  createInventory: {
    success: boolean;
    message: string;
    inventory?: InventoryType;
  };
}

/*
-----------------UPDATE INVENTORY-----------------
*/

export interface UpdateInventoryInput {
  id: string;
  quantity: number;
  brandId?: string;
  name?: string;
  width?: number;
  height?: number;
  material?: string;
  specifications?: string;
  description?: string;
  notes?: string;
  imagesToAdd?: InventoryImageInput[];
  imagesToRemove?: string[];
}

export interface UpdateInventoryVariables {
  input: UpdateInventoryInput;
}

export interface UpdateInventoryResponse {
  updateInventory: {
    success: boolean;
    message: string;
    inventory?: InventoryType;
  };
}

/*
-----------------DELETE INVENTORY-----------------
*/

export interface DeleteInventoryVariables {
  inventoryId: string;
}

export interface DeleteInventoryResponse {
  deleteInventory: {
    success: boolean;
    message: string;
  };
}

/*
-----------------GENERATE INVENTORY UPLOAD URL-----------------
*/

export interface GenerateInventoryUploadUrlInput {
  brandName: string;
  inventoryName: string;
  filename: string;
}

export interface GenerateInventoryUploadUrlVariables {
  input: GenerateInventoryUploadUrlInput;
}

export interface GenerateInventoryUploadUrlResponse {
  generateInventoryUploadUrl: {
    success: boolean;
    message: string;
    uploadUrl?: string;
    fileKey?: string;
  };
}
