import { gql } from '@apollo/client';

/**
 * Shared pagination fields used across all list queries.
 *
 * Used by: GET_USERS, GET_PSPS, GET_BRANDS, GET_AUDIT_LOGS
 */
export const PAGINATION_FIELDS = gql`
  fragment PaginationFields on PaginationInfo {
    totalCount
    page
    pageSize
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;

/**
 * Shared incomplete campaign fields used in status-update mutations.
 *
 * Used by: UPDATE_BRAND_STATUS, UPDATE_PSP_STATUS
 */
export const INCOMPLETE_CAMPAIGN_FIELDS = gql`
  fragment IncompleteCampaignFields on IncompleteCampaignType {
    id
    name
    status
    incompleteOrders {
      id
      orderNumber
      status
    }
  }
`;

/**
 * Shared incomplete order fields used in store status-update mutations.
 *
 * Used by: UPDATE_STORE_STATUS
 */
export const INCOMPLETE_ORDER_FIELDS = gql`
  fragment IncompleteOrderFields on IncompleteOrderType {
    id
    orderNumber
    status
  }
`;
