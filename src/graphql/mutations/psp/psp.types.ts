import { IncompleteCampaignType, IncompleteOrderType, PSPType } from '@/types/graphql.types';

/*
-----------------CREATE PSP-----------------
*/

export interface CreatePSPArguments {
  input: CreatePSPInput;
}

export interface CreatePSPInput {
  name: string;
  address: string;
  countryId: string;
  stateId: string;
  cityName: string;
  zipCode: number;
  website?: string;
}

export interface CreatePSPResponse {
  createPsp: {
    success: boolean;
    message: string;
    psp: PSPType;
  };
}

/*
-----------------UPDATE PSP-----------------
*/

export interface UpdatePSPArguments {
  input: UpdatePSPInput;
}

export interface UpdatePSPInput extends Partial<CreatePSPInput> {
  id: string;
  pspAdminUserIds?: string[];
  prodOperatorUserIds?: string[];
}

export interface UpdatePSPResponse {
  updatePsp: {
    success: boolean;
    message: string;
    psp: PSPType;
  };
}

/*
-----------------DELETE PSP-----------------
*/

export interface DeletePSPArguments {
  input: DeletePSPInput;
}

export interface DeletePSPInput {
  id: string;
}

export interface DeletePSPResponse {
  deletePsp: {
    success: boolean;
    message: string;
  };
}

/*
-----------------UPDATE PSP STATUS-----------------
*/

export interface UpdatePSPStatusArguments {
  input: UpdatePSPStatusInput;
}

export interface UpdatePSPStatusInput {
  id: string;
  isActive: boolean;
}

export interface UpdatePSPStatusResponse {
  updatePspStatus: {
    success: boolean;
    message: string;
    psp: PSPType;
    incompleteCampaigns?: IncompleteCampaignType[];
    incompleteOrders?: IncompleteOrderType[];
  };
}
