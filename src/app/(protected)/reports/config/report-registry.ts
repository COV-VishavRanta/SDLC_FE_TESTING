import {
  CampaignSummaryReportSortField,
  ExceptionQueueReportSortField,
  ExecutionProofReportSortField,
  IssuesReordersReportSortField,
  OpsDashboardMetricsReportSortField,
  ProofReviewReportSortField,
  ReportKey,
  ShipmentsTrackingReportSortField,
  StoreOrdersReportSortField,
  SurveyResponseReportSortField,
  UserRole,
} from '@/constant';
import {
  EXPORT_CAMPAIGN_SUMMARY_REPORT,
  EXPORT_EXCEPTION_QUEUE_REPORT,
  EXPORT_EXECUTION_PROOF_REPORT,
  EXPORT_ISSUES_REORDERS_REPORT,
  EXPORT_OPS_DASHBOARD_METRICS_REPORT,
  EXPORT_PROOF_REVIEW_REPORT,
  EXPORT_SHIPMENTS_TRACKING_REPORT,
  EXPORT_STORE_ORDERS_REPORT,
  EXPORT_SURVEY_RESPONSE_REPORT,
  GET_CAMPAIGN_SUMMARY_REPORT,
  GET_EXCEPTION_QUEUE_REPORT,
  GET_EXECUTION_PROOF_REPORT,
  GET_ISSUES_REORDERS_REPORT,
  GET_OPS_DASHBOARD_METRICS_REPORT,
  GET_PROOF_REVIEW_REPORT,
  GET_SHIPMENTS_TRACKING_REPORT,
  GET_STORE_ORDERS_REPORT,
  GET_SURVEY_RESPONSE_REPORT,
} from '@/graphql';
import { DocumentNode } from '@apollo/client';
import { ColumnDef } from '@tanstack/react-table';
import type { useTranslations } from 'next-intl';

import { getCampaignSummaryColumns } from '../(components)/report-table/columns/campaign-summary.columns';
import { getExceptionQueueColumns } from '../(components)/report-table/columns/exception-queue.columns';
import { getExecutionProofColumns } from '../(components)/report-table/columns/execution-proof.columns';
import { getIssuesReordersColumns } from '../(components)/report-table/columns/issues-reorders.columns';
import { getOpsDashboardColumns } from '../(components)/report-table/columns/ops-dashboard.columns';
import { getProofReviewColumns } from '../(components)/report-table/columns/proof-review.columns';
import { getShipmentsTrackingColumns } from '../(components)/report-table/columns/shipments-tracking.columns';
import { getStoreOrdersColumns } from '../(components)/report-table/columns/store-orders.columns';
import { getSurveyResponseColumns } from '../(components)/report-table/columns/survey-response.columns';

export type TranslateFn = ReturnType<typeof useTranslations>;

export type ReportEntityType = 'psp' | 'brand' | 'none';

export interface ReportConfig {
  key: ReportKey;
  labelKey: string;
  entityType: ReportEntityType;
  allowedRoles: UserRole[];
  fetchQuery: DocumentNode;
  exportQuery: DocumentNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColumns: () => ColumnDef<any>[];
  sortFieldMap: Record<string, string>;
  dataPath: string;
  exportDataPath: string;
  defaultSort: { id: string; desc: boolean };
  columnCount: number;
}

const PSP_ROLES: UserRole[] = [UserRole.PSP_ADMIN, UserRole.PRODUCTION_OPERATOR];

const BRAND_ROLES: UserRole[] = [UserRole.BRAND_ADMIN, UserRole.CAMPAIGN_MANAGER];

const REGIONAL_ROLES: UserRole[] = [UserRole.REGIONAL_MANAGER];

export const REPORT_REGISTRY: ReportConfig[] = [
  {
    key: ReportKey.CAMPAIGN_SUMMARY,
    labelKey: 'reportLabels.campaignSummary',
    entityType: 'brand',
    allowedRoles: BRAND_ROLES,
    fetchQuery: GET_CAMPAIGN_SUMMARY_REPORT,
    exportQuery: EXPORT_CAMPAIGN_SUMMARY_REPORT,
    getColumns: () => getCampaignSummaryColumns(),
    sortFieldMap: {
      campaignName: CampaignSummaryReportSortField.CAMPAIGN_NAME,
      campaignType: CampaignSummaryReportSortField.CAMPAIGN_TYPE,
      campaignManagerName: CampaignSummaryReportSortField.CAMPAIGN_MANAGER_NAME,
      brandName: CampaignSummaryReportSortField.BRAND_NAME,
      pspName: CampaignSummaryReportSortField.PSP_NAME,
      campaignStatus: CampaignSummaryReportSortField.CAMPAIGN_STATUS,
      campaignStartDate: CampaignSummaryReportSortField.CAMPAIGN_START_DATE,
      shipByDate: CampaignSummaryReportSortField.SHIP_BY_DATE,
      campaignEndDate: CampaignSummaryReportSortField.CAMPAIGN_END_DATE,
      totalStoresAssigned: CampaignSummaryReportSortField.TOTAL_STORES_ASSIGNED,
      storesCompleted: CampaignSummaryReportSortField.STORES_COMPLETED,
      completionPercentage: CampaignSummaryReportSortField.COMPLETION_PERCENTAGE,
      lateShipments: CampaignSummaryReportSortField.LATE_SHIPMENTS,
      anomaliesReported: CampaignSummaryReportSortField.ANOMALIES_REPORTED,
      reordersRaised: CampaignSummaryReportSortField.REORDERS_RAISED,
      photosRejected: CampaignSummaryReportSortField.PHOTOS_REJECTED,
    },
    dataPath: 'campaignSummaryReport',
    exportDataPath: 'exportCampaignSummaryReport',
    defaultSort: { id: 'campaignName', desc: false },
    columnCount: 10,
  },
  {
    key: ReportKey.EXCEPTION_QUEUE,
    labelKey: 'reportLabels.exceptionQueue',
    entityType: 'none',
    allowedRoles: REGIONAL_ROLES,
    fetchQuery: GET_EXCEPTION_QUEUE_REPORT,
    exportQuery: EXPORT_EXCEPTION_QUEUE_REPORT,
    getColumns: () => getExceptionQueueColumns(),
    sortFieldMap: {
      issueNumber: ExceptionQueueReportSortField.ISSUE_NUMBER,
      storeName: ExceptionQueueReportSortField.STORE_NAME,
      storeNumber: ExceptionQueueReportSortField.STORE_NUMBER,
      campaignName: ExceptionQueueReportSortField.CAMPAIGN_NAME,
      shipmentNumber: ExceptionQueueReportSortField.SHIPMENT_NUMBER,
      exceptionType: ExceptionQueueReportSortField.EXCEPTION_TYPE,
      dueDate: ExceptionQueueReportSortField.DUE_DATE,
      daysOverdue: ExceptionQueueReportSortField.DAYS_OVERDUE,
      assignedRegionalAdmin: ExceptionQueueReportSortField.ASSIGNED_REGIONAL_ADMIN,
      lastActionTaken: ExceptionQueueReportSortField.LAST_ACTION_TAKEN,
      lastActionDate: ExceptionQueueReportSortField.LAST_ACTION_DATE,
      reorderStatus: ExceptionQueueReportSortField.REORDER_STATUS,
      affectedQuantity: ExceptionQueueReportSortField.AFFECTED_QUANTITY,
    },
    dataPath: 'exceptionQueueReport',
    exportDataPath: 'exportExceptionQueueReport',
    defaultSort: { id: 'issueNumber', desc: false },
    columnCount: 11,
  },
  {
    key: ReportKey.EXECUTION_PROOF,
    labelKey: 'reportLabels.executionProof',
    entityType: 'brand',
    allowedRoles: BRAND_ROLES,
    fetchQuery: GET_EXECUTION_PROOF_REPORT,
    exportQuery: EXPORT_EXECUTION_PROOF_REPORT,
    getColumns: () => getExecutionProofColumns(),
    sortFieldMap: {
      campaignName: ExecutionProofReportSortField.CAMPAIGN_NAME,
      storeName: ExecutionProofReportSortField.STORE_NAME,
      storeNumber: ExecutionProofReportSortField.STORE_NUMBER,
      orderNumber: ExecutionProofReportSortField.ORDER_NUMBER,
      itemName: ExecutionProofReportSortField.ITEM_NAME,
      itemQuantity: ExecutionProofReportSortField.ITEM_QUANTITY,
      proofSubmittedOn: ExecutionProofReportSortField.PROOF_SUBMITTED_ON,
      proofVerificationStatus: ExecutionProofReportSortField.PROOF_VERIFICATION_STATUS,
      approvedPhotoCount: ExecutionProofReportSortField.APPROVED_PHOTO_COUNT,
      attestedBy: ExecutionProofReportSortField.ATTESTED_BY,
      attestedOn: ExecutionProofReportSortField.ATTESTED_ON,
    },
    dataPath: 'executionProofReport',
    exportDataPath: 'exportExecutionProofReport',
    defaultSort: { id: 'campaignName', desc: false },
    columnCount: 11,
  },
  {
    key: ReportKey.ISSUES_REORDERS,
    labelKey: 'reportLabels.issuesReorders',
    entityType: 'psp',
    allowedRoles: PSP_ROLES,
    fetchQuery: GET_ISSUES_REORDERS_REPORT,
    exportQuery: EXPORT_ISSUES_REORDERS_REPORT,
    getColumns: () => getIssuesReordersColumns(),
    sortFieldMap: {
      issueNumber: IssuesReordersReportSortField.ISSUE_NUMBER,
      campaignName: IssuesReordersReportSortField.CAMPAIGN_NAME,
      storeName: IssuesReordersReportSortField.STORE_NAME,
      storeNumber: IssuesReordersReportSortField.STORE_NUMBER,
      itemName: IssuesReordersReportSortField.ITEM_NAME,
      issueType: IssuesReordersReportSortField.ISSUE_TYPE,
      affectedQuantity: IssuesReordersReportSortField.AFFECTED_QUANTITY,
      issueRaisedOn: IssuesReordersReportSortField.ISSUE_RAISED_ON,
      approvalStatus: IssuesReordersReportSortField.APPROVAL_STATUS,
      approvedBy: IssuesReordersReportSortField.APPROVED_BY,
      reorderNumber: IssuesReordersReportSortField.REORDER_NUMBER,
      decisionDate: IssuesReordersReportSortField.DECISION_DATE,
      replacementShipmentNumber: IssuesReordersReportSortField.REPLACEMENT_SHIPMENT_NUMBER,
    },
    dataPath: 'issuesReordersReport',
    exportDataPath: 'exportIssuesReordersReport',
    defaultSort: { id: 'issueNumber', desc: false },
    columnCount: 9,
  },
  {
    key: ReportKey.OPS_DASHBOARD_METRICS,
    labelKey: 'reportLabels.opsDashboardMetrics',
    entityType: 'psp',
    allowedRoles: PSP_ROLES,
    fetchQuery: GET_OPS_DASHBOARD_METRICS_REPORT,
    exportQuery: EXPORT_OPS_DASHBOARD_METRICS_REPORT,
    getColumns: () => getOpsDashboardColumns(),
    sortFieldMap: {
      weekLabel: OpsDashboardMetricsReportSortField.WEEK_LABEL,
      weekStartDate: OpsDashboardMetricsReportSortField.WEEK_START_DATE,
      totalShipments: OpsDashboardMetricsReportSortField.TOTAL_SHIPMENTS,
      lateShipments: OpsDashboardMetricsReportSortField.LATE_SHIPMENTS,
      ordersPendingFulfillment: OpsDashboardMetricsReportSortField.ORDERS_PENDING_FULFILLMENT,
      reorderRequestsRaised: OpsDashboardMetricsReportSortField.REORDER_REQUESTS_RAISED,
      slaCompliancePercentage: OpsDashboardMetricsReportSortField.SLA_COMPLIANCE_PERCENTAGE,
    },
    dataPath: 'opsDashboardMetricsReport',
    exportDataPath: 'exportOpsDashboardMetricsReport',
    defaultSort: { id: 'weekStartDate', desc: true },
    columnCount: 7,
  },
  {
    key: ReportKey.PROOF_REVIEW,
    labelKey: 'reportLabels.proofReview',
    entityType: 'none',
    allowedRoles: REGIONAL_ROLES,
    fetchQuery: GET_PROOF_REVIEW_REPORT,
    exportQuery: EXPORT_PROOF_REVIEW_REPORT,
    getColumns: () => getProofReviewColumns(),
    sortFieldMap: {
      storeName: ProofReviewReportSortField.STORE_NAME,
      storeNumber: ProofReviewReportSortField.STORE_NUMBER,
      campaignName: ProofReviewReportSortField.CAMPAIGN_NAME,
      itemName: ProofReviewReportSortField.ITEM_NAME,
      submissionDate: ProofReviewReportSortField.SUBMISSION_DATE,
      reviewStatus: ProofReviewReportSortField.REVIEW_STATUS,
      rejectionReason: ProofReviewReportSortField.REJECTION_REASON,
      reviewerName: ProofReviewReportSortField.REVIEWER_NAME,
      reviewDate: ProofReviewReportSortField.REVIEW_DATE,
      retakeRequired: ProofReviewReportSortField.RETAKE_REQUIRED,
      retakeStatus: ProofReviewReportSortField.RETAKE_STATUS,
      retakeDueDate: ProofReviewReportSortField.RETAKE_DUE_DATE,
      proofImageLinks: ProofReviewReportSortField.PROOF_IMAGE_LINKS,
    },
    dataPath: 'proofReviewReport',
    exportDataPath: 'exportProofReviewReport',
    defaultSort: { id: 'storeName', desc: false },
    columnCount: 10,
  },
  {
    key: ReportKey.SHIPMENTS_TRACKING,
    labelKey: 'reportLabels.shipmentsTracking',
    entityType: 'psp',
    allowedRoles: PSP_ROLES,
    fetchQuery: GET_SHIPMENTS_TRACKING_REPORT,
    exportQuery: EXPORT_SHIPMENTS_TRACKING_REPORT,
    getColumns: () => getShipmentsTrackingColumns(),
    sortFieldMap: {
      shipmentNumber: ShipmentsTrackingReportSortField.SHIPMENT_NUMBER,
      campaignName: ShipmentsTrackingReportSortField.CAMPAIGN_NAME,
      orderNumber: ShipmentsTrackingReportSortField.ORDER_NUMBER,
      storeName: ShipmentsTrackingReportSortField.STORE_NAME,
      storeNumber: ShipmentsTrackingReportSortField.STORE_NUMBER,
      trackingNumber: ShipmentsTrackingReportSortField.TRACKING_NUMBER,
      carrierName: ShipmentsTrackingReportSortField.CARRIER_NAME,
      eta: ShipmentsTrackingReportSortField.ETA,
      quantityShipped: ShipmentsTrackingReportSortField.QUANTITY_SHIPPED,
      shippedOn: ShipmentsTrackingReportSortField.SHIPPED_ON,
      deliveredOn: ShipmentsTrackingReportSortField.DELIVERED_ON,
      shipmentStatus: ShipmentsTrackingReportSortField.SHIPMENT_STATUS,
      partialShipment: ShipmentsTrackingReportSortField.PARTIAL_SHIPMENT,
    },
    dataPath: 'shipmentsTrackingReport',
    exportDataPath: 'exportShipmentsTrackingReport',
    defaultSort: { id: 'shipmentNumber', desc: false },
    columnCount: 12,
  },
  {
    key: ReportKey.STORE_ORDERS,
    labelKey: 'reportLabels.storeOrders',
    entityType: 'psp',
    allowedRoles: PSP_ROLES,
    fetchQuery: GET_STORE_ORDERS_REPORT,
    exportQuery: EXPORT_STORE_ORDERS_REPORT,
    getColumns: () => getStoreOrdersColumns(),
    sortFieldMap: {
      campaignName: StoreOrdersReportSortField.CAMPAIGN_NAME,
      storeName: StoreOrdersReportSortField.STORE_NAME,
      storeNumber: StoreOrdersReportSortField.STORE_NUMBER,
      storeAlias: StoreOrdersReportSortField.STORE_ALIAS,
      itemName: StoreOrdersReportSortField.ITEM_NAME,
      quantity: StoreOrdersReportSortField.QUANTITY,
      orderNumber: StoreOrdersReportSortField.ORDER_NUMBER,
      orderCreatedAt: StoreOrdersReportSortField.ORDER_CREATED_AT,
      isReorder: StoreOrdersReportSortField.IS_REORDER,
      pspOrderReference: StoreOrdersReportSortField.PSP_ORDER_REFERENCE,
      pspAcknowledgedOn: StoreOrdersReportSortField.PSP_ACKNOWLEDGED_ON,
      orderLineNumber: StoreOrdersReportSortField.ORDER_LINE_NUMBER,
      orderStatus: StoreOrdersReportSortField.ORDER_STATUS,
    },
    dataPath: 'storeOrdersReport',
    exportDataPath: 'exportStoreOrdersReport',
    defaultSort: { id: 'campaignName', desc: false },
    columnCount: 10,
  },
  {
    key: ReportKey.SURVEY_RESPONSE,
    labelKey: 'reportLabels.surveyResponse',
    entityType: 'brand',
    allowedRoles: BRAND_ROLES,
    fetchQuery: GET_SURVEY_RESPONSE_REPORT,
    exportQuery: EXPORT_SURVEY_RESPONSE_REPORT,
    getColumns: () => getSurveyResponseColumns(),
    sortFieldMap: {
      surveyName: SurveyResponseReportSortField.SURVEY_NAME,
      surveyStatus: SurveyResponseReportSortField.SURVEY_STATUS,
      brandName: SurveyResponseReportSortField.BRAND_NAME,
      storeName: SurveyResponseReportSortField.STORE_NAME,
      storeNumber: SurveyResponseReportSortField.STORE_NUMBER,
      responseStatus: SurveyResponseReportSortField.RESPONSE_STATUS,
      assignedAt: SurveyResponseReportSortField.ASSIGNED_AT,
      assignedBy: SurveyResponseReportSortField.ASSIGNED_BY,
      submittedBy: SurveyResponseReportSortField.SUBMITTED_BY,
      submittedAt: SurveyResponseReportSortField.SUBMITTED_AT,
    },
    dataPath: 'surveyResponseReport',
    exportDataPath: 'exportSurveyResponseReport',
    defaultSort: { id: 'surveyName', desc: false },
    columnCount: 10,
  },
];

export function getAvailableReports(role: UserRole): ReportConfig[] {
  return REPORT_REGISTRY.filter((config) => config.allowedRoles.includes(role));
}
