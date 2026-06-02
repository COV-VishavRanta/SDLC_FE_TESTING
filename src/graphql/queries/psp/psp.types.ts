import { PSPSortField, SortOrder } from '@/constant';
import { PaginationInfo, PSPType } from '@/types';

/*
-----------------PSP LISTS-----------------
*/
export interface GetPSPsVariables {
  page?: number; // default: 1
  pageSize?: number; // default: 20
  filter?: PSPFilterInput;
  sort?: PSPSortInput;
}

export interface PSPFilterInput {
  isActive?: boolean;
  search?: string;
}

export interface PSPSortInput {
  field: PSPSortField;
  order: SortOrder;
}

export interface GetPSPsResponse {
  psps: {
    psps: PSPType[];
    pagination: PaginationInfo;
    totalPsps: number;
    activePsps: number;
    inactivePsps: number;
  };
}

/*
-----------------PSP DETAILS-----------------
*/
export interface GetPSPDetailsVariables {
  id: string;
}

export interface GetPSPDetailsResponse {
  pspDetails: {
    success: boolean;
    message: string;
    psp: PSPType | null;
  };
}
