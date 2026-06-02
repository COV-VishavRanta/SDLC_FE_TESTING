import { BrandType, IncompleteCampaignType, IncompleteOrderType } from '@/types';

/*
-----------------CREATE BRAND-----------------
*/

export interface CreateBrandInput {
  pspId: string;
  name: string;
  countryId: string;
  stateId: string;
  cityName: string;
  website?: string;
  zipCode: number;
  address: string;
}

export interface CreateBrandVariables {
  input: CreateBrandInput;
}

export interface CreateBrandResponse {
  createBrand: {
    success: boolean;
    message: string;
    brand?: BrandType;
  };
}

/*
-----------------UPDATE BRAND-----------------
*/

export interface UpdateBrandInput {
  id: string;
  name?: string;
  countryId?: string;
  stateId?: string;
  cityName?: string;
  zipCode?: number;
  website?: string;
  address?: string;
}

export interface UpdateBrandVariables {
  input: UpdateBrandInput;
}

export interface UpdateBrandResponse {
  updateBrand: {
    success: boolean;
    message: string;
    brand?: BrandType;
  };
}

/*
-----------------DELETE BRAND-----------------
*/

export interface DeleteBrandInput {
  id: string;
}

export interface DeleteBrandVariables {
  input: DeleteBrandInput;
}

export interface DeleteBrandResponse {
  deleteBrand: {
    success: boolean;
    message: string;
  };
}

/*
-----------------UPDATE BRAND STATUS-----------------
*/

export interface UpdateBrandStatusInput {
  id: string;
  isActive: boolean;
}

export interface UpdateBrandStatusVariables {
  input: UpdateBrandStatusInput;
}

export interface UpdateBrandStatusResponse {
  updateBrandStatus: {
    success: boolean;
    message: string;
    brand?: BrandType;
    incompleteCampaigns?: IncompleteCampaignType[];
    incompleteOrders?: IncompleteOrderType[];
  };
}
