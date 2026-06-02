export interface ShipmentItemInput {
  orderItemId: string;
  quantityToShip: number;
}

export interface CreateShipmentInput {
  orderId: string;
  trackingNumber: string;
  carrierName: string;
  eta: string;
  notes?: string;
  items: ShipmentItemInput[];
}

export interface ShipmentItemType {
  id: string;
  shipmentId: string;
  orderItemId: string;
  quantityShipped: number;
  promotionName?: string;
  createdAt: string;
}

export interface ShipmentType {
  id: string;
  shipmentNumber: number;
  orderId: string;
  trackingNumber: string;
  eta: string;
  carrierName: string;
  status: string;
  notes?: string;
  createdAt: string;
  items: ShipmentItemType[];
}

export interface CreateShipmentVariables {
  input: CreateShipmentInput;
}

export interface CreateShipmentPayload {
  success: boolean;
  message: string;
  shipment?: ShipmentType;
}

export interface CreateShipmentResponse {
  createShipment: CreateShipmentPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// RECEIVE SHIPMENT – TYPES
// ─────────────────────────────────────────────────────────────────────────────

import { ShipmentExceptionEnum, ShipmentReorderStatusEnum } from '@/constant';

export interface ReceiveShipmentItemInput {
  shipmentItemId: string;
  quantityReceived: number;
  discrepancyQuantity?: number;
  exceptionType?: ShipmentExceptionEnum;
}

export interface ReorderImageInput {
  name: string;
  type: string;
  key: string;
}

export interface ReceiveShipmentInput {
  shipmentId: string;
  items: ReceiveShipmentItemInput[];
  reason?: string;
  images?: ReorderImageInput[];
}

export interface ReceiveShipmentVariables {
  input: ReceiveShipmentInput;
}

export interface ReorderImageUploadType {
  name: string;
  key: string;
  uploadUrl: string;
}

export interface ShipmentReorderType {
  id: string;
  status: string;
  reason: string;
  imageUploads?: ReorderImageUploadType[];
}

export interface ReceiveShipmentPayload {
  success: boolean;
  message: string;
  shipmentReorder?: ShipmentReorderType;
}

export interface ReceiveShipmentResponse {
  receiveShipment: ReceiveShipmentPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REORDER UPLOAD URL – TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ReorderUploadImageInput {
  name: string;
  type: string;
}

export interface GenerateReorderUploadUrlInput {
  shipmentId: string;
  images: ReorderUploadImageInput[];
}

export interface GenerateReorderUploadUrlVariables {
  input: GenerateReorderUploadUrlInput;
}

export interface GenerateReorderUploadUrlPayload {
  success: boolean;
  message: string;
  uploads: ReorderImageUploadType[];
}

export interface GenerateReorderUploadUrlResponse {
  generateReorderUploadUrl: GenerateReorderUploadUrlPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEPTION REQUEST MUTATION – TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionExceptionRequestInput {
  reorderId: string;
  action: ShipmentReorderStatusEnum;
  reason?: string;
}

export interface ActionExceptionRequestVariables {
  input: ActionExceptionRequestInput;
}

export interface ExceptionRequestActionPayload {
  success: boolean;
  message: string;
}

export interface ActionExceptionRequestResponse {
  actionExceptionRequest: ExceptionRequestActionPayload;
}

export interface UpdateExceptionRequestInput {
  reorderId: string;
  reason: string;
  images: ReorderImageInput[];
}

export interface UpdateExceptionRequestVariables {
  input: UpdateExceptionRequestInput;
}

export interface UpdateExceptionRequestResponse {
  updateExceptionRequest: ExceptionRequestActionPayload;
}
