import { CampaignStatusEnum, ImportPromotionMode } from '@/constant';
import { CampaignType, PromotionType, StoreDistributionResult } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN MUTATIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------CREATE CAMPAIGN-----------------
*/

export interface CreateCampaignInput {
  brandId: string;
  name: string;
  objective: string;
  description: string;
  startDate: string;
  endDate: string;
  shipByDate: string;
  campaignManagerId?: string;
  isPermanent: boolean;
}

export interface CreateCampaignVariables {
  input: CreateCampaignInput;
}

export interface CreateCampaignResponse {
  createCampaign: {
    success: boolean;
    message: string;
    campaign?: CampaignType;
  };
}

/*
-----------------UPDATE CAMPAIGN-----------------
*/

export interface UpdateCampaignInput {
  id: string;
  name: string;
  objective: string;
  description: string;
  startDate: string;
  endDate: string;
  shipByDate: string;
  campaignManagerId?: string;
  isPermanent?: boolean;
}

export interface UpdateCampaignVariables {
  input: UpdateCampaignInput;
}

export interface UpdateCampaignResponse {
  updateCampaign: {
    success: boolean;
    message: string;
    campaign?: CampaignType;
  };
}

/*
-----------------ARCHIVE CAMPAIGN-----------------
*/

export interface ArchiveCampaignInput {
  id: string;
  archive: boolean;
}

export interface ArchiveCampaignVariables {
  input: ArchiveCampaignInput;
}

export interface ArchiveCampaignResponse {
  archiveCampaign: {
    success: boolean;
    message: string;
    campaign?: Pick<CampaignType, 'id' | 'name' | 'status' | 'isArchived'>;
  };
}

/*
-----------------DELETE CAMPAIGN-----------------
*/

export interface DeleteCampaignInput {
  id: string;
}

export interface DeleteCampaignVariables {
  input: DeleteCampaignInput;
}

export interface DeleteCampaignResponse {
  deleteCampaign: {
    success: boolean;
    message: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION MUTATIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------CREATE PROMOTION-----------------
*/

export interface PromotionImageInput {
  name: string;
  type: string;
  key: string;
  isPrimary: boolean;
}

export interface CreatePromotionInput {
  campaignId: string;
  name: string;
  width: number;
  height: number;
  material?: string;
  specifications?: string;
  description?: string;
  needDesign: boolean;
  isReusable: boolean;
  images?: PromotionImageInput[];
}

export interface CreatePromotionVariables {
  input: CreatePromotionInput;
}

export interface CreatePromotionResponse {
  createPromotion: {
    success: boolean;
    message: string;
    promotion?: PromotionType;
  };
}

/*
-----------------UPDATE PROMOTION-----------------
*/

export interface UpdatePromotionInput {
  id: string;
  name: string;
  width: number;
  height: number;
  material?: string;
  specifications?: string;
  description?: string;
  needDesign: boolean;
  isReusable: boolean;
  imagesToAdd?: PromotionImageInput[];
  imagesToRemove?: string[];
}

export interface UpdatePromotionVariables {
  input: UpdatePromotionInput;
}

export interface UpdatePromotionResponse {
  updatePromotion: {
    success: boolean;
    message: string;
    promotion?: PromotionType;
  };
}

/*
-----------------DELETE PROMOTION-----------------
*/

export interface DeletePromotionVariables {
  promotionId: string;
}

export interface DeletePromotionResponse {
  deletePromotion: {
    success: boolean;
    message: string;
  };
}

/*
-----------------CREATE PROMOTIONS FROM INVENTORY-----------------
*/

export interface CreatePromotionsFromInventoryInput {
  campaignId: string;
  inventoryIds: string[];
}

export interface CreatePromotionsFromInventoryVariables {
  input: CreatePromotionsFromInventoryInput;
}

export interface CreatePromotionsFromInventoryResponse {
  createPromotionsFromInventory: {
    success: boolean;
    message: string;
    promotions?: PromotionType[];
  };
}

/*
-----------------GENERATE PROMOTION UPLOAD URL-----------------
*/

export interface GeneratePromotionUploadUrlInput {
  campaignName: string;
  promotionName: string;
  filename: string;
}

export interface GeneratePromotionUploadUrlVariables {
  input: GeneratePromotionUploadUrlInput;
}

export interface GeneratePromotionUploadUrlResponse {
  generatePromotionUploadUrl: {
    success: boolean;
    message: string;
    uploadUrl?: string;
    fileKey?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE DISTRIBUTION MUTATIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------DISTRIBUTE PROMOTIONS TO STORES-----------------
*/

export interface StoreDistributionInput {
  storeId: string;
  quantity: number;
  orderItemId?: string;
}

export interface DistributePromotionsToStoresInput {
  promotionId: string;
  distributions: StoreDistributionInput[];
}

export interface DistributePromotionsToStoresVariables {
  input: DistributePromotionsToStoresInput;
}

export interface DistributePromotionsToStoresResponse {
  distributePromotionsToStores: {
    success: boolean;
    message: string;
    results?: StoreDistributionResult[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT CAMPAIGN – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------SUBMIT CAMPAIGN-----------------
*/

export interface SubmitCampaignInput {
  id: string;
}

export interface SubmitCampaignVariables {
  input: SubmitCampaignInput;
}

export interface SubmitCampaignResponse {
  submitCampaign: {
    success: boolean;
    message: string;
    campaign?: CampaignType;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT PROMOTIONS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------IMPORT PROMOTIONS-----------------
*/

export interface ImportPromotionsInput {
  targetCampaignId: string;
  sourceCampaignId: string;
  promotionIds: string[];
  mode: ImportPromotionMode;
}

export interface ImportPromotionsVariables {
  input: ImportPromotionsInput;
}

export interface ImportPromotionsResponse {
  importPromotions: {
    success: boolean;
    message: string;
    promotions?: PromotionType[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSIGN CAMPAIGN MANAGER – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------ASSIGN CAMPAIGN MANAGER-----------------
*/

export interface AssignCampaignManagerInput {
  id: string;
}

export interface AssignCampaignManagerVariables {
  input: AssignCampaignManagerInput;
}

export interface AssignCampaignManagerResponse {
  assignCampaignManager: {
    success: boolean;
    message: string;
    campaign?: CampaignType;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE CAMPAIGN STATUS – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------CHANGE CAMPAIGN STATUS-----------------
*/

export interface ChangeCampaignStatusInput {
  campaignId: string;
  newStatus: CampaignStatusEnum;
}

export interface ChangeCampaignStatusVariables {
  input: ChangeCampaignStatusInput;
}

export interface ChangeCampaignStatusResponse {
  changeCampaignStatus: {
    success: boolean;
    message: string;
    campaign?: CampaignType;
  };
}
