import { IncompleteCampaignType, StoreType } from '@/types';

/*
-----------------CREATE STORE-----------------
*/

export interface CreateStoreInput {
  brandId: string;
  name: string;
  storeNumber?: string;
  address: string;
  countryId: string;
  stateId: string;
  cityName: string;
  zipCode: number;
  phoneNumber: string;
}

export interface CreateStoreVariables {
  input: CreateStoreInput;
}

export interface CreateStoreResponse {
  createStore: {
    success: boolean;
    message: string;
    store?: StoreType;
  };
}

/*
-----------------UPDATE STORE-----------------
*/

export interface UpdateStoreInput {
  id: string;
  name?: string;
  storeNumber?: string;
  address?: string;
  countryId?: string;
  stateId?: string;
  cityName?: string;
  zipCode?: number;
  phoneNumber?: string;
}

export interface UpdateStoreVariables {
  input: UpdateStoreInput;
}

export interface UpdateStoreResponse {
  updateStore: {
    success: boolean;
    message: string;
    store?: StoreType;
  };
}

/*
-----------------DELETE STORE-----------------
*/

export interface DeleteStoreInput {
  id: string;
}

export interface DeleteStoreVariables {
  input: DeleteStoreInput;
}

export interface DeleteStoreResponse {
  deleteStore: {
    success: boolean;
    message: string;
  };
}

/*
-----------------UPDATE STORE STATUS-----------------
*/

export interface UpdateStoreStatusInput {
  id: string;
  isActive: boolean;
}

export interface UpdateStoreStatusVariables {
  input: UpdateStoreStatusInput;
}

export interface UpdateStoreStatusResponse {
  updateStoreStatus: {
    success: boolean;
    message: string;
    store?: StoreType;
    incompleteCampaigns?: IncompleteCampaignType[];
  };
}
