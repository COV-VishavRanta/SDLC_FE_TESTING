import {
  ExportFormat,
  InstallationStatusEnum,
  IssuesReordersReportSortField,
  OpsDashboardMetricsReportSortField,
  OrderStatusEnum,
  ShipmentExceptionEnum,
  ShipmentReorderStatusEnum,
  ShipmentStatusEnum,
  ShipmentsTrackingReportSortField,
  SortOrder,
  StoreOrdersReportSortField,
} from '@/constant';
import { PaginationInfo } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED REPORT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface StatusSummaryCount {
  status: string;
  count: number;
}

export interface ReportExportPayload {
  success: boolean;
  message: string;
  fileContent: string;
  fileName: string;
  contentType: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE ORDERS REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface StoreOrdersReportFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  orderStatus?: OrderStatusEnum;
}

export interface StoreOrdersReportSortInput {
  field: StoreOrdersReportSortField;
  order: SortOrder;
}

export interface StoreOrdersReportSummary {
  totalItems: number;
  byOrderStatus: StatusSummaryCount[];
}

export interface StoreOrderLineItemType {
  campaignName: string;
  storeName: string;
  storeNumber?: string;
  storeAlias?: string;
  itemName: string;
  quantity: number;
  orderNumber: number;
  orderCreatedAt: string;
  isReorder: boolean;
  pspOrderReference?: string;
  pspAcknowledgedOn?: string;
  orderLineNumber?: string;
  orderStatus: string;
}

export interface GetStoreOrdersReportVariables {
  pspId: string;
  page?: number;
  pageSize?: number;
  filter?: StoreOrdersReportFilterInput;
  sort?: StoreOrdersReportSortInput;
}

export interface StoreOrdersReportPayload {
  success: boolean;
  message: string;
  summary: StoreOrdersReportSummary;
  items: StoreOrderLineItemType[];
  pagination: PaginationInfo;
}

export interface GetStoreOrdersReportResponse {
  storeOrdersReport: StoreOrdersReportPayload;
}

export interface ExportStoreOrdersReportVariables {
  pspId: string;
  exportFormat: ExportFormat;
  filter?: StoreOrdersReportFilterInput;
  sort?: StoreOrdersReportSortInput;
}

export interface ExportStoreOrdersReportResponse {
  exportStoreOrdersReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIPMENTS TRACKING REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface ShipmentsTrackingReportFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  shipmentStatus?: ShipmentStatusEnum;
}

export interface ShipmentsTrackingReportSortInput {
  field: ShipmentsTrackingReportSortField;
  order: SortOrder;
}

export interface ShipmentsTrackingReportSummary {
  totalShipments: number;
  partialShipmentCount: number;
  byShipmentStatus: StatusSummaryCount[];
}

export interface ShipmentTrackingLineItemType {
  shipmentNumber: number;
  campaignName: string;
  orderNumber: number;
  storeName: string;
  storeNumber?: string;
  trackingNumber: string;
  carrierName: string;
  eta?: string;
  quantityShipped: number;
  shippedOn?: string;
  deliveredOn?: string;
  shipmentStatus: string;
  partialShipment: boolean;
}

export interface GetShipmentsTrackingReportVariables {
  pspId: string;
  page?: number;
  pageSize?: number;
  filter?: ShipmentsTrackingReportFilterInput;
  sort?: ShipmentsTrackingReportSortInput;
}

export interface ShipmentsTrackingReportPayload {
  success: boolean;
  message: string;
  summary: ShipmentsTrackingReportSummary;
  items: ShipmentTrackingLineItemType[];
  pagination: PaginationInfo;
}

export interface GetShipmentsTrackingReportResponse {
  shipmentsTrackingReport: ShipmentsTrackingReportPayload;
}

export interface ExportShipmentsTrackingReportVariables {
  pspId: string;
  exportFormat: ExportFormat;
  filter?: ShipmentsTrackingReportFilterInput;
  sort?: ShipmentsTrackingReportSortInput;
}

export interface ExportShipmentsTrackingReportResponse {
  exportShipmentsTrackingReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISSUES & REORDERS REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface IssuesReordersReportFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  approvalStatus?: ShipmentReorderStatusEnum;
  issueType?: ShipmentExceptionEnum;
}

export interface IssuesReordersReportSortInput {
  field: IssuesReordersReportSortField;
  order: SortOrder;
}

export interface IssuesReordersReportSummary {
  totalIssues: number;
  pendingApprovalCount: number;
  byApprovalStatus: StatusSummaryCount[];
  byIssueType: StatusSummaryCount[];
}

export interface IssueReorderLineItemType {
  issueNumber: number;
  campaignName: string;
  storeName: string;
  storeNumber?: string;
  itemName: string;
  issueType: string;
  affectedQuantity: number;
  issueRaisedOn: string;
  approvalStatus: string;
  approvedBy?: string;
  decisionDate?: string;
  reorderNumber?: number;
  replacementShipmentNumber?: number;
}

export interface GetIssuesReordersReportVariables {
  pspId: string;
  page?: number;
  pageSize?: number;
  filter?: IssuesReordersReportFilterInput;
  sort?: IssuesReordersReportSortInput;
}

export interface IssuesReordersReportPayload {
  success: boolean;
  message: string;
  summary: IssuesReordersReportSummary;
  items: IssueReorderLineItemType[];
  pagination: PaginationInfo;
}

export interface GetIssuesReordersReportResponse {
  issuesReordersReport: IssuesReordersReportPayload;
}

export interface ExportIssuesReordersReportVariables {
  pspId: string;
  exportFormat: ExportFormat;
  filter?: IssuesReordersReportFilterInput;
  sort?: IssuesReordersReportSortInput;
}

export interface ExportIssuesReordersReportResponse {
  exportIssuesReordersReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// OPS DASHBOARD METRICS REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface OpsDashboardMetricsReportFilterInput {
  startDate?: string;
  endDate?: string;
  campaignId?: string;
  storeId?: string;
}

export interface OpsDashboardMetricsReportSortInput {
  field: OpsDashboardMetricsReportSortField;
  order: SortOrder;
}

export interface OpsDashboardMetricsReportSummary {
  weeksCovered: number;
  totalLateShipments: number;
  totalReorderRequestsRaised: number;
  currentOrdersPendingFulfillment: number;
  overallSlaCompliancePercentage: number;
  totalShipmentsInRange: number;
}

export interface OpsDashboardMetricsLineItemType {
  weekStartDate: string;
  weekLabel: string;
  totalShipments: number;
  lateShipments: number;
  ordersPendingFulfillment: number;
  reorderRequestsRaised: number;
  slaCompliancePercentage: number;
}

export interface GetOpsDashboardMetricsReportVariables {
  pspId: string;
  page?: number;
  pageSize?: number;
  filter?: OpsDashboardMetricsReportFilterInput;
  sort?: OpsDashboardMetricsReportSortInput;
}

export interface OpsDashboardMetricsReportPayload {
  success: boolean;
  message: string;
  summary: OpsDashboardMetricsReportSummary;
  items: OpsDashboardMetricsLineItemType[];
  pagination: PaginationInfo;
}

export interface GetOpsDashboardMetricsReportResponse {
  opsDashboardMetricsReport: OpsDashboardMetricsReportPayload;
}

export interface ExportOpsDashboardMetricsReportVariables {
  pspId: string;
  exportFormat: ExportFormat;
  filter?: OpsDashboardMetricsReportFilterInput;
  sort?: OpsDashboardMetricsReportSortInput;
}

export interface ExportOpsDashboardMetricsReportResponse {
  exportOpsDashboardMetricsReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN SUMMARY REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface CampaignSummaryReportFilterInput {
  search?: string;
  campaignStatus?: string;
}

export interface CampaignSummaryReportSortInput {
  field: string;
  order: SortOrder;
}

export interface CampaignSummaryReportSummary {
  totalCampaigns: number;
  totalLateShipments: number;
  totalAnomaliesReported: number;
  totalReordersRaised: number;
  totalPhotosRejected: number;
  averageCompletionPercentage: number;
  byCampaignStatus: StatusSummaryCount[];
}

export interface CampaignSummaryLineItemType {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  campaignManagerName?: string;
  brandName: string;
  pspName: string;
  campaignStatus: string;
  campaignStartDate: string;
  shipByDate: string;
  campaignEndDate: string;
  totalStoresAssigned: number;
  storesCompleted: number;
  storesPendingProof: number;
  completionPercentage: number;
  lateShipments: number;
  anomaliesReported: number;
  reordersRaised: number;
  photosRejected: number;
}

export interface GetCampaignSummaryReportVariables {
  brandId: string;
  page?: number;
  pageSize?: number;
  filter?: CampaignSummaryReportFilterInput;
  sort?: CampaignSummaryReportSortInput;
}

export interface CampaignSummaryReportPayload {
  success: boolean;
  message: string;
  summary: CampaignSummaryReportSummary;
  items: CampaignSummaryLineItemType[];
  pagination: PaginationInfo;
}

export interface GetCampaignSummaryReportResponse {
  campaignSummaryReport: CampaignSummaryReportPayload;
}

export interface ExportCampaignSummaryReportVariables {
  brandId: string;
  exportFormat: ExportFormat;
  filter?: CampaignSummaryReportFilterInput;
  sort?: CampaignSummaryReportSortInput;
}

export interface ExportCampaignSummaryReportResponse {
  exportCampaignSummaryReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION & PROOF REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface ExecutionProofReportFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  executionStatus?: OrderStatusEnum;
  proofVerificationStatus?: InstallationStatusEnum;
  proofSubmittedFrom?: string;
  proofSubmittedTo?: string;
  attestedFrom?: string;
  attestedTo?: string;
}

export interface ExecutionProofReportSortInput {
  field: string;
  order: SortOrder;
}

export interface ExecutionProofReportSummary {
  totalItems: number;
  approvedPhotoTotal: number;
  byExecutionStatus: StatusSummaryCount[];
  byProofVerificationStatus: StatusSummaryCount[];
}

export interface ExecutionProofLineItemType {
  orderItemId: string;
  campaignName: string;
  storeName: string;
  storeNumber?: string;
  orderNumber: number;
  itemName: string;
  itemQuantity: number;
  proofSubmittedOn?: string;
  proofVerificationStatus: string;
  installationRejectionReason?: string;
  approvedPhotoCount: number;
  attestedBy?: string;
  attestedOn?: string;
  proofImageLinks: string[];
}

export interface GetExecutionProofReportVariables {
  brandId: string;
  page?: number;
  pageSize?: number;
  filter?: ExecutionProofReportFilterInput;
  sort?: ExecutionProofReportSortInput;
}

export interface ExecutionProofReportPayload {
  success: boolean;
  message: string;
  summary: ExecutionProofReportSummary;
  items: ExecutionProofLineItemType[];
  pagination: PaginationInfo;
}

export interface GetExecutionProofReportResponse {
  executionProofReport: ExecutionProofReportPayload;
}

export interface ExportExecutionProofReportVariables {
  brandId: string;
  exportFormat: ExportFormat;
  filter?: ExecutionProofReportFilterInput;
  sort?: ExecutionProofReportSortInput;
}

export interface ExportExecutionProofReportResponse {
  exportExecutionProofReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEPTION QUEUE REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface ExceptionQueueReportFilterInput {
  search?: string;
  campaignId?: string;
  storeId?: string;
  exceptionType?: ShipmentExceptionEnum;
  reorderStatus?: ShipmentReorderStatusEnum;
}

export interface ExceptionQueueReportSortInput {
  field: string;
  order: SortOrder;
}

export interface ExceptionQueueReportSummary {
  totalExceptions: number;
  overdueCount: number;
  byExceptionType: StatusSummaryCount[];
  byReorderStatus: StatusSummaryCount[];
}

export interface ExceptionQueueLineItemType {
  issueNumber: number;
  storeName: string;
  storeNumber?: string;
  campaignName: string;
  shipmentNumber: number;
  exceptionType: string;
  dueDate?: string;
  daysOverdue: number;
  assignedRegionalAdmin?: string;
  lastActionTaken: string;
  lastActionDate?: string;
  itemName: string;
  reorderStatus: string;
  affectedQuantity: number;
}

export interface GetExceptionQueueReportVariables {
  page?: number;
  pageSize?: number;
  filter?: ExceptionQueueReportFilterInput;
  sort?: ExceptionQueueReportSortInput;
}

export interface ExceptionQueueReportPayload {
  success: boolean;
  message: string;
  summary: ExceptionQueueReportSummary;
  items: ExceptionQueueLineItemType[];
  pagination: PaginationInfo;
}

export interface GetExceptionQueueReportResponse {
  exceptionQueueReport: ExceptionQueueReportPayload;
}

export interface ExportExceptionQueueReportVariables {
  exportFormat: ExportFormat;
  filter?: ExceptionQueueReportFilterInput;
  sort?: ExceptionQueueReportSortInput;
}

export interface ExportExceptionQueueReportResponse {
  exportExceptionQueueReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROOF REVIEW REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface ProofReviewReportFilterInput {
  search?: string;
  storeId?: string;
  campaignId?: string;
  reviewStatus?: InstallationStatusEnum;
  retakeRequired?: boolean;
}

export interface ProofReviewReportSortInput {
  field: string;
  order: SortOrder;
}

export interface ProofReviewReportSummary {
  totalItems: number;
  pendingReview: number;
  totalApproved: number;
  totalRejected: number;
  totalRetakesRequired: number;
  totalRetakesCompleted: number;
  byReviewStatus: StatusSummaryCount[];
}

export interface ProofReviewLineItemType {
  orderItemId: string;
  storeName: string;
  storeNumber?: string;
  campaignName: string;
  itemName: string;
  submissionDate?: string;
  reviewStatus: string;
  rejectionReason?: string;
  reviewerName?: string;
  reviewDate?: string;
  retakeRequired: boolean;
  retakeStatus: string;
  retakeDueDate?: string;
  proofImageLinks: string[];
}

export interface GetProofReviewReportVariables {
  page?: number;
  pageSize?: number;
  filter?: ProofReviewReportFilterInput;
  sort?: ProofReviewReportSortInput;
}

export interface ProofReviewReportPayload {
  success: boolean;
  message: string;
  summary: ProofReviewReportSummary;
  items: ProofReviewLineItemType[];
  pagination: PaginationInfo;
}

export interface GetProofReviewReportResponse {
  proofReviewReport: ProofReviewReportPayload;
}

export interface ExportProofReviewReportVariables {
  exportFormat: ExportFormat;
  filter?: ProofReviewReportFilterInput;
  sort?: ProofReviewReportSortInput;
}

export interface ExportProofReviewReportResponse {
  exportProofReviewReport: ReportExportPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY RESPONSE REPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface SurveyResponseReportFilterInput {
  search?: string;
  surveyId?: string;
  storeId?: string;
  responseStatus?: string;
}

export interface SurveyResponseReportSortInput {
  field: string;
  order: SortOrder;
}

export interface SurveyResponseReportSummary {
  totalAssignedStores: number;
  totalResponsesSubmitted: number;
  pendingResponses: number;
  byResponseStatus: StatusSummaryCount[];
  bySurvey: StatusSummaryCount[];
}

export interface SurveyResponseLineItemType {
  surveyName: string;
  surveyStatus: string;
  brandName: string;
  storeName: string;
  storeNumber?: string;
  storeAlias?: string;
  responseStatus: string;
  assignedAt: string;
  assignedBy?: string;
  submittedBy?: string;
  submittedAt?: string;
}

export interface GetSurveyResponseReportVariables {
  brandId: string;
  page?: number;
  pageSize?: number;
  filter?: SurveyResponseReportFilterInput;
  sort?: SurveyResponseReportSortInput;
}

export interface SurveyResponseReportPayload {
  success: boolean;
  message: string;
  summary: SurveyResponseReportSummary;
  items: SurveyResponseLineItemType[];
  pagination: PaginationInfo;
}

export interface GetSurveyResponseReportResponse {
  surveyResponseReport: SurveyResponseReportPayload;
}

export interface ExportSurveyResponseReportVariables {
  brandId: string;
  exportFormat: ExportFormat;
  filter?: SurveyResponseReportFilterInput;
  sort?: SurveyResponseReportSortInput;
}

export interface ExportSurveyResponseReportResponse {
  exportSurveyResponseReport: ReportExportPayload;
}
