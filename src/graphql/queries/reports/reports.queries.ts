import { gql } from '@apollo/client';

/**
 * Paginated Store Orders report for a given PSP.
 * Accessible by PSP Admin, and Production Operator.
 */
export const GET_STORE_ORDERS_REPORT = gql`
  query GetStoreOrdersReport(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: StoreOrdersReportFilterInput
    $sort: StoreOrdersReportSortInput
  ) {
    storeOrdersReport(
      pspId: $pspId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalItems
        byOrderStatus {
          status
          count
        }
      }
      items {
        campaignName
        storeName
        storeNumber
        storeAlias
        itemName
        quantity
        orderNumber
        orderCreatedAt
        isReorder
        pspOrderReference
        pspAcknowledgedOn
        orderLineNumber
        orderStatus
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Store Orders report as a base64-encoded file.
 */
export const EXPORT_STORE_ORDERS_REPORT = gql`
  query ExportStoreOrdersReport(
    $pspId: UUID!
    $exportFormat: ExportFormat!
    $filter: StoreOrdersReportFilterInput
    $sort: StoreOrdersReportSortInput
  ) {
    exportStoreOrdersReport(
      pspId: $pspId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Shipments & Tracking report for a given PSP.
 * Accessible by PSP Admin, and Production Operator.
 */
export const GET_SHIPMENTS_TRACKING_REPORT = gql`
  query GetShipmentsTrackingReport(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: ShipmentsTrackingReportFilterInput
    $sort: ShipmentsTrackingReportSortInput
  ) {
    shipmentsTrackingReport(
      pspId: $pspId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalShipments
        partialShipmentCount
        byShipmentStatus {
          status
          count
        }
      }
      items {
        shipmentNumber
        campaignName
        orderNumber
        storeName
        storeNumber
        trackingNumber
        carrierName
        eta
        quantityShipped
        shippedOn
        deliveredOn
        shipmentStatus
        partialShipment
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Shipments & Tracking report as a base64-encoded file.
 */
export const EXPORT_SHIPMENTS_TRACKING_REPORT = gql`
  query ExportShipmentsTrackingReport(
    $pspId: UUID!
    $exportFormat: ExportFormat!
    $filter: ShipmentsTrackingReportFilterInput
    $sort: ShipmentsTrackingReportSortInput
  ) {
    exportShipmentsTrackingReport(
      pspId: $pspId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Issues & Reorders report for a given PSP.
 * Accessible by PSP Admin, and Production Operator.
 */
export const GET_ISSUES_REORDERS_REPORT = gql`
  query GetIssuesReordersReport(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: IssuesReordersReportFilterInput
    $sort: IssuesReordersReportSortInput
  ) {
    issuesReordersReport(
      pspId: $pspId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalIssues
        pendingApprovalCount
        byApprovalStatus {
          status
          count
        }
        byIssueType {
          status
          count
        }
      }
      items {
        issueNumber
        campaignName
        storeName
        storeNumber
        itemName
        issueType
        affectedQuantity
        issueRaisedOn
        approvalStatus
        approvedBy
        decisionDate
        reorderNumber
        replacementShipmentNumber
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Issues & Reorders report as a base64-encoded file.
 */
export const EXPORT_ISSUES_REORDERS_REPORT = gql`
  query ExportIssuesReordersReport(
    $pspId: UUID!
    $exportFormat: ExportFormat!
    $filter: IssuesReordersReportFilterInput
    $sort: IssuesReordersReportSortInput
  ) {
    exportIssuesReordersReport(
      pspId: $pspId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Ops Dashboard Metrics (Weekly) report for a given PSP.
 * Accessible by PSP Admin, and Production Operator.
 */
export const GET_OPS_DASHBOARD_METRICS_REPORT = gql`
  query GetOpsDashboardMetricsReport(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: OpsDashboardMetricsReportFilterInput
    $sort: OpsDashboardMetricsReportSortInput
  ) {
    opsDashboardMetricsReport(
      pspId: $pspId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        weeksCovered
        totalLateShipments
        totalReorderRequestsRaised
        currentOrdersPendingFulfillment
        overallSlaCompliancePercentage
        totalShipmentsInRange
      }
      items {
        weekStartDate
        weekLabel
        totalShipments
        lateShipments
        ordersPendingFulfillment
        reorderRequestsRaised
        slaCompliancePercentage
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Ops Dashboard Metrics (Weekly) report as a base64-encoded file.
 */
export const EXPORT_OPS_DASHBOARD_METRICS_REPORT = gql`
  query ExportOpsDashboardMetricsReport(
    $pspId: UUID!
    $exportFormat: ExportFormat!
    $filter: OpsDashboardMetricsReportFilterInput
    $sort: OpsDashboardMetricsReportSortInput
  ) {
    exportOpsDashboardMetricsReport(
      pspId: $pspId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Campaign Summary report for a given Brand.
 * Accessible by Brand Admin, and Campaign Manager.
 */
export const GET_CAMPAIGN_SUMMARY_REPORT = gql`
  query GetCampaignSummaryReport(
    $brandId: UUID!
    $page: Int
    $pageSize: Int
    $filter: CampaignSummaryReportFilterInput
    $sort: CampaignSummaryReportSortInput
  ) {
    campaignSummaryReport(
      brandId: $brandId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalCampaigns
        totalLateShipments
        totalAnomaliesReported
        totalReordersRaised
        totalPhotosRejected
        averageCompletionPercentage
        byCampaignStatus {
          status
          count
        }
      }
      items {
        campaignId
        campaignName
        campaignType
        campaignManagerName
        brandName
        pspName
        campaignStatus
        campaignStartDate
        shipByDate
        campaignEndDate
        totalStoresAssigned
        storesCompleted
        storesPendingProof
        completionPercentage
        lateShipments
        anomaliesReported
        reordersRaised
        photosRejected
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Campaign Summary report as a base64-encoded file.
 */
export const EXPORT_CAMPAIGN_SUMMARY_REPORT = gql`
  query ExportCampaignSummaryReport(
    $brandId: UUID!
    $exportFormat: ExportFormat!
    $filter: CampaignSummaryReportFilterInput
    $sort: CampaignSummaryReportSortInput
  ) {
    exportCampaignSummaryReport(
      brandId: $brandId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Execution & Proof Export (line-level) report for a given Brand.
 * Accessible by Brand Admin, and Campaign Manager.
 */
export const GET_EXECUTION_PROOF_REPORT = gql`
  query GetExecutionProofReport(
    $brandId: UUID!
    $page: Int
    $pageSize: Int
    $filter: ExecutionProofReportFilterInput
    $sort: ExecutionProofReportSortInput
  ) {
    executionProofReport(
      brandId: $brandId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalItems
        approvedPhotoTotal
        byExecutionStatus {
          status
          count
        }
        byProofVerificationStatus {
          status
          count
        }
      }
      items {
        orderItemId
        campaignName
        storeName
        storeNumber
        orderNumber
        itemName
        itemQuantity
        proofSubmittedOn
        proofVerificationStatus
        installationRejectionReason
        approvedPhotoCount
        attestedBy
        attestedOn
        proofImageLinks
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Execution & Proof report as a base64-encoded file.
 */
export const EXPORT_EXECUTION_PROOF_REPORT = gql`
  query ExportExecutionProofReport(
    $brandId: UUID!
    $exportFormat: ExportFormat!
    $filter: ExecutionProofReportFilterInput
    $sort: ExecutionProofReportSortInput
  ) {
    exportExecutionProofReport(
      brandId: $brandId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Exception Queue report for a Regional Manager's assigned stores.
 * Accessible by Regional Manager.
 */
export const GET_EXCEPTION_QUEUE_REPORT = gql`
  query GetExceptionQueueReport(
    $page: Int
    $pageSize: Int
    $filter: ExceptionQueueReportFilterInput
    $sort: ExceptionQueueReportSortInput
  ) {
    exceptionQueueReport(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      success
      message
      summary {
        totalExceptions
        overdueCount
        byExceptionType {
          status
          count
        }
        byReorderStatus {
          status
          count
        }
      }
      items {
        issueNumber
        storeName
        storeNumber
        campaignName
        shipmentNumber
        exceptionType
        dueDate
        daysOverdue
        assignedRegionalAdmin
        lastActionTaken
        lastActionDate
        itemName
        reorderStatus
        affectedQuantity
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Exception Queue report as a base64-encoded file.
 */
export const EXPORT_EXCEPTION_QUEUE_REPORT = gql`
  query ExportExceptionQueueReport(
    $exportFormat: ExportFormat!
    $filter: ExceptionQueueReportFilterInput
    $sort: ExceptionQueueReportSortInput
  ) {
    exportExceptionQueueReport(exportFormat: $exportFormat, filter: $filter, sort: $sort) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Proof Review report for a Regional Manager's assigned stores.
 * Accessible by Regional Manager.
 */
export const GET_PROOF_REVIEW_REPORT = gql`
  query GetProofReviewReport(
    $page: Int
    $pageSize: Int
    $filter: ProofReviewReportFilterInput
    $sort: ProofReviewReportSortInput
  ) {
    proofReviewReport(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      success
      message
      summary {
        totalItems
        pendingReview
        totalApproved
        totalRejected
        totalRetakesRequired
        totalRetakesCompleted
        byReviewStatus {
          status
          count
        }
      }
      items {
        orderItemId
        storeName
        storeNumber
        campaignName
        itemName
        submissionDate
        reviewStatus
        rejectionReason
        reviewerName
        reviewDate
        retakeRequired
        retakeStatus
        retakeDueDate
        proofImageLinks
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Proof Review report as a base64-encoded file.
 */
export const EXPORT_PROOF_REVIEW_REPORT = gql`
  query ExportProofReviewReport(
    $exportFormat: ExportFormat!
    $filter: ProofReviewReportFilterInput
    $sort: ProofReviewReportSortInput
  ) {
    exportProofReviewReport(exportFormat: $exportFormat, filter: $filter, sort: $sort) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;

/**
 * Paginated Survey Response report for a given Brand.
 * Accessible by Brand Admin, and Campaign Manager.
 */
export const GET_SURVEY_RESPONSE_REPORT = gql`
  query GetSurveyResponseReport(
    $brandId: UUID!
    $page: Int
    $pageSize: Int
    $filter: SurveyResponseReportFilterInput
    $sort: SurveyResponseReportSortInput
  ) {
    surveyResponseReport(
      brandId: $brandId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      success
      message
      summary {
        totalAssignedStores
        totalResponsesSubmitted
        pendingResponses
        byResponseStatus {
          status
          count
        }
        bySurvey {
          status
          count
        }
      }
      items {
        surveyName
        surveyStatus
        brandName
        storeName
        storeNumber
        storeAlias
        responseStatus
        assignedAt
        assignedBy
        submittedBy
        submittedAt
      }
      pagination {
        totalCount
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Export the full Survey Response report as a base64-encoded file.
 */
export const EXPORT_SURVEY_RESPONSE_REPORT = gql`
  query ExportSurveyResponseReport(
    $brandId: UUID!
    $exportFormat: ExportFormat!
    $filter: SurveyResponseReportFilterInput
    $sort: SurveyResponseReportSortInput
  ) {
    exportSurveyResponseReport(
      brandId: $brandId
      exportFormat: $exportFormat
      filter: $filter
      sort: $sort
    ) {
      success
      message
      fileContent
      fileName
      contentType
    }
  }
`;
