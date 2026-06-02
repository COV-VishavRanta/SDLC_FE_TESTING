import { SortOrder, StoreSortField } from '@/constant';
import { PaginationInfo, StoreType } from '@/types';

/*
-----------------STORES BY BRAND-----------------
*/

export interface GetStoresByBrandVariables {
  brandId: string;
}

export interface GetStoresByBrandResponse {
  getStoresByBrand: {
    success: boolean;
    message: string;
    stores: Pick<StoreType, 'id' | 'name' | 'storeNumber' | 'isActive'>[];
  };
}

/*
-----------------STORE LIST-----------------
*/

export interface GetStoresVariables {
  page?: number; // default: 1
  pageSize?: number; // default: 20
  filter?: StoreFilterInput;
  sort?: StoreSortInput;
  brandId: string;
}

export interface StoreFilterInput {
  search?: string;
  isActive?: boolean;
}

export interface StoreSortInput {
  field: StoreSortField;
  order: SortOrder;
}

export interface GetStoresResponse {
  stores: {
    success: boolean;
    message: string;
    stores: StoreType[];
    pagination?: PaginationInfo;
    totalStores: number;
    activeStores: number;
    inactiveStores: number;
  };
}

/*
-----------------STORE DETAILS-----------------
*/
export interface GetStoreDetailsVariables {
  id: string;
}

export interface GetStoreDetailsResponse {
  storeDetails: {
    success: boolean;
    message: string;
    store: StoreType | null;
  };
}
