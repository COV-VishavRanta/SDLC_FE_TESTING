import { BrandSortField, SortOrder } from '@/constant';
import { BrandType, PaginationInfo } from '@/types';

/*
-----------------BRAND LIST-----------------
*/

export interface GetBrandsVariables {
  pspId: string;
  page?: number; // default: 1
  pageSize?: number; // default: 20
  filter?: BrandFilterInput;
  sort?: BrandSortInput;
}

export interface BrandFilterInput {
  search?: string;
  isActive?: boolean;
}

export interface BrandSortInput {
  field: BrandSortField;
  order: SortOrder;
}

export interface GetBrandsResponse {
  listBrands: {
    brands: BrandType[];
    pagination: PaginationInfo;
    /** Total number of brands */
    totalBrands: number;
    /** Number of active brands */
    activeBrands: number;
    /** Number of inactive brands */
    inactiveBrands: number;
  };
}

/*
-----------------BRAND DETAILS-----------------
*/
export interface GetBrandDetailsVariables {
  id: string;
}

export interface GetBrandDetailsResponse {
  brandDetails: {
    success: boolean;
    message: string;
    brand: BrandType | null;
  };
}
