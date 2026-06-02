import {
  CampaignFilterInput,
  CampaignSortInput,
  CampaignStatusCounts,
  CampaignType,
  PaginationInfo,
  PromotionDetailPayload,
  PromotionType,
  StoreDistributionPayload,
  StoreOrderType,
  UserType,
} from '@/types';

import { SortOrder } from '@/constant';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GET CAMPAIGN (SINGLE)-----------------
*/

export interface GetCampaignVariables {
  campaignId: string;
}

export interface GetCampaignResponse {
  campaign: {
    success: boolean;
    campaign?: CampaignType;
  };
}

/*
-----------------LIST CAMPAIGNS-----------------
*/

export interface ListCampaignsVariables {
  brandId?: string; //send it when viewing as Brand Admin or equivalent role
  pspId?: string; // send it when viewing as PSP Admin or equivalent role
  storeId?: string; // send it when viewing as Store Admin or equivalent role
  page?: number;
  pageSize?: number;
  filter?: CampaignFilterInput;
  sort?: CampaignSortInput;
}

export interface ListCampaignsResponse {
  listCampaigns: {
    success: boolean;
    message: string;
    campaigns: CampaignType[];
    pagination?: PaginationInfo;
    statusCounts?: CampaignStatusCounts;
    stores: CampaignStoreOption[];
  };
}

export interface CampaignStoreOption {
  id: string;
  name: string;
}

/*
-----------------GET CAMPAIGN MANAGERS BY BRAND-----------------
*/

export interface GetCampaignManagersByBrandVariables {
  brandId: string;
}

export interface GetCampaignManagersByBrandResponse {
  getCampaignManagersByBrand: Pick<UserType, 'id' | 'name' | 'email'>[];
}

/*
-----------------GET CAMPAIGN STORE ORDERS-----------------
*/

export interface GetCampaignStoreOrdersVariables {
  campaignId: string;
  storeId?: string;
}

export interface GetCampaignStoreOrdersResponse {
  campaignStoreOrders: {
    success: boolean;
    message: string;
    stores: StoreOrderType[];
  };
}

/*
-----------------GET CAMPAIGN STORE ORDER (SINGLE)-----------------
*/

export interface GetCampaignStoreOrderVariables {
  campaignId: string;
  orderNumber: number;
}

export interface GetCampaignStoreOrderResponse {
  campaignStoreOrder: {
    success: boolean;
    message: string;
    storeOrder?: StoreOrderType;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GET PROMOTIONS BY CAMPAIGN-----------------
*/

export interface GetPromotionsByCampaignVariables {
  campaignId: string;
  page?: number;
  pageSize?: number;
  storeId?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export interface GetPromotionsByCampaignResponse {
  promotionsByCampaign: {
    success: boolean;
    message?: string;
    promotions?: PromotionType[];
    pagination?: PaginationInfo;
  };
}

/*
-----------------GET PROMOTION DETAIL-----------------
*/

export interface GetPromotionDetailVariables {
  promotionId: string;
  storeId?: string;
}

export interface GetPromotionDetailResponse {
  promotionDetail: PromotionDetailPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE DISTRIBUTION QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GET STORE DISTRIBUTION BY PROMOTION-----------------
*/

export interface GetStoreDistributionByPromotionVariables {
  promotionId: string;
}

export interface GetStoreDistributionByPromotionResponse {
  storeDistributionByPromotion: StoreDistributionPayload;
}
