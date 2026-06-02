import { gql } from '@apollo/client';

import { PAGINATION_FIELDS } from '../../fragments';

/**
 * Fetch a paginated list of notifications with related audit log data.
 * Scope can be filtered by pspId, brandId, or storeId.
 */
export const GET_NOTIFICATIONS = gql`
  query GetNotifications(
    $pspId: UUID
    $brandId: UUID
    $storeId: UUID
    $search: String
    $page: Int! = 1
    $pageSize: Int! = 20
  ) {
    notifications(
      pspId: $pspId
      brandId: $brandId
      storeId: $storeId
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      success
      message
      notifications {
        id
        title
        message
        entityType
        entityId
        isRead
        isAlert
        createdAt
        readAt
        pspId
        brandId
        storeId
        auditLog {
          id
          action
          entityType
          entityId
          entityName
          createdAt
          newValue
          oldValue
        }
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${PAGINATION_FIELDS}
`;
