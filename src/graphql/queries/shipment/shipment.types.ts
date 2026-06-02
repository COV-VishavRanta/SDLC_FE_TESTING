import {
  ExceptionRequestSortField,
  ShipmentExceptionEnum,
  ShipmentReorderStatusEnum,
  ShipmentSortField,
  ShipmentStatusEnum,
} from '@/constant';
import {
  ExceptionRequestDetailType,
  ExceptionRequestListItemType,
  ExceptionRequestStatusCountsType,
  PaginationInfo,
} from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// SHIPMENT QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------LIST SHIPMENTS-----------------
*/

export interface ShipmentFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  status?: ShipmentStatusEnum;
}

export interface ShipmentSortInput {
  field: ShipmentSortField;
  order: string;
}

export interface ShipmentListStoreType {
  id: string;
  name: string;
  stateAbbr?: string;
  countryName?: string;
}

export interface ShipmentListItemType {
  shipmentId: string;
  shipmentNumber: number;
  orderNumber: string;
  campaignName: string;
  campaignId: string;
  store: ShipmentListStoreType;
  shipmentEta: string;
  trackingNumber: string;
  carrierName: string;
  status: string;
  totalItems: number;
  distinctPromotions: number;
}

export interface ShipmentSummary {
  totalShipments: number;
  received: number;
  shipped: number;
  receivedWithException: number;
}

export interface ShipmentFilterOption {
  id: string;
  name: string;
}

export interface ShipmentFilterOptions {
  campaigns: ShipmentFilterOption[];
  stores: ShipmentFilterOption[];
}

export interface ListShipmentsVariables {
  pspId?: string;
  brandId?: string;
  storeId?: string;
  page?: number;
  pageSize?: number;
  filter?: ShipmentFilterInput;
  sort?: ShipmentSortInput;
}

export interface ListShipmentsResponse {
  listShipments: {
    success: boolean;
    message: string;
    shipments: ShipmentListItemType[];
    pagination?: PaginationInfo;
    summary?: ShipmentSummary;
    filterOptions?: ShipmentFilterOptions;
  };
}

/*
-----------------GET SHIPMENT DETAILS-----------------
*/

export interface ShipmentDetailStoreType {
  name: string;
  countryName?: string;
  stateAbbr?: string;
}

export interface ShipmentDetailItemType {
  shipmentItemId: string;
  promotionName: string;
  quantityShipped: number;
  receivedQuantity: number;
  exceptionType?: ShipmentExceptionEnum;
}

export interface ShipmentDetailType {
  id: string;
  shipmentNumber: number;
  orderNumber: string;
  campaignName: string;
  store: ShipmentDetailStoreType;
  shipmentDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  carrierName: string;
  status: string;
  notes?: string;
  items: ShipmentDetailItemType[];
  itemsPagination?: PaginationInfo;
  totalItems: number;
  totalPromotions: number;
}

export interface GetShipmentDetailsVariables {
  shipmentNumber: number;
  itemsPage?: number;
  itemsPageSize?: number;
  itemsSearch?: string;
  itemsSortOrder?: string;
}

export interface GetShipmentDetailsResponse {
  getShipmentDetails: {
    success: boolean;
    message: string;
    shipment?: ShipmentDetailType;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEPTION REQUEST QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ExceptionRequestFilterInput {
  search?: string;
  status?: ShipmentReorderStatusEnum;
  storeId?: string;
  campaignId?: string;
}

export interface ExceptionRequestFilterOptions {
  campaigns: ShipmentFilterOption[];
  stores: ShipmentFilterOption[];
}

export interface ExceptionRequestSortInput {
  field?: ExceptionRequestSortField;
  order?: string;
}

export interface ListExceptionRequestsVariables {
  brandId?: string;
  storeId?: string;
  page?: number;
  pageSize?: number;
  filter?: ExceptionRequestFilterInput;
  sort?: ExceptionRequestSortInput;
}

export interface ListExceptionRequestsResponse {
  listExceptionRequests: {
    success: boolean;
    message: string;
    exceptionRequests: ExceptionRequestListItemType[];
    pagination?: PaginationInfo;
    statusCounts?: ExceptionRequestStatusCountsType;
    filterOptions?: ExceptionRequestFilterOptions;
  };
}

export interface GetExceptionRequestDetailsVariables {
  reorderId: string;
}

export interface GetExceptionRequestDetailsResponse {
  getExceptionRequestDetails: {
    success: boolean;
    message: string;
    exceptionRequest?: ExceptionRequestDetailType;
  };
}

// Re-export for convenience
export type {
  ExceptionRequestDetailType,
  ExceptionRequestListItemType,
  ExceptionRequestStatusCountsType,
  ShipmentReorderStatusEnum,
};
